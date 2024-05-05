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
		const req = context.switchToHttp().getRequest();
		const queryRunner: QueryRunner = await this.dbInit();

		req[QUERY_RUNNER_CONTEXT] = queryRunner.manager;

		return next.handle().pipe(
			catchError(async (error) => {
				if (queryRunner.isTransactionActive) {
					await queryRunner.rollbackTransaction();
				}
				if (!queryRunner.isReleased) {
					await queryRunner.release();
				}

				if (error instanceof Exception || error instanceof HttpException) {
					throw error;
				}
				if (queryFailedGuard(error)) {
					throw new DbException(error);
				}
				throw new InternalException(error);
			}),
			tap(async () => {
				if (queryRunner.isTransactionActive) {
					await queryRunner.rollbackTransaction();
				}
				if (!queryRunner.isReleased) {
					await queryRunner.release();
				}
			}),
			finalize(async () => {
				if (queryRunner.isTransactionActive) {
					await queryRunner.rollbackTransaction();
				}
				if (!queryRunner.isReleased) {
					await queryRunner.release();
				}
			}),
		);
	}

	private async dbInit(): Promise<QueryRunner> {
		const queryRunner = this.dataSource.createQueryRunner();

		return queryRunner;
	}
}

const queryFailedGuard = (
	err: unknown,
): err is QueryFailedError & { code: string } =>
	err instanceof QueryFailedError;
