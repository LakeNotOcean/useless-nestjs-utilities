import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { DataSource, QueryFailedError, QueryRunner } from 'typeorm';
import { Exception, InternalException } from '../exceptions';
import { QUERY_RUNNER_CONTEXT } from '../lib-constants';
import { DbException } from './db.exception';

// initializing a connection to the database from the connection pool when receiving a request
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
	constructor(private readonly dataSource: DataSource) {}
	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<unknown>> {
		const request = context.switchToHttp().getRequest();
		const queryRunner: QueryRunner = await this.dbInit();

		request[QUERY_RUNNER_CONTEXT] = queryRunner.manager;

		return next.handle().pipe(
			catchError(async (error) => {
				await finishTransaction(queryRunner);

				if (error instanceof Exception || error instanceof HttpException) {
					throw error;
				}
				if (isQueryFailedGuard(error)) {
					throw new DbException({ ...error, errorCode: error.code });
				}
				throw new InternalException(error);
			}),
			tap(async () => {
				await finishTransaction(queryRunner);
			}),
			finalize(async () => {
				await finishTransaction(queryRunner);
			}),
		);
	}

	private async dbInit(): Promise<QueryRunner> {
		return this.dataSource.createQueryRunner();
	}
}

function isQueryFailedGuard(
	err: unknown,
): err is QueryFailedError & { code: string } {
	return err instanceof QueryFailedError;
}

async function finishTransaction(queryRunner: QueryRunner) {
	if (queryRunner.isTransactionActive) {
		await queryRunner.rollbackTransaction();
	}
	if (!queryRunner.isReleased) {
		await queryRunner.release();
	}
}
