import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { Exception } from 'src/exceptions/base.exceptions';
import { InternalException } from 'src/exceptions/server.exceptions';
import { DataSource, QueryRunner } from 'typeorm';
import { DbException } from './db.exception';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const queryRunner: QueryRunner = await this.dbInit();

    req.queryRunnerManager = queryRunner.manager;

    return next.handle().pipe(
      catchError(async error => {
        if (queryRunner.isTransactionActive) {
          await queryRunner.rollbackTransaction();
        }
        if (!queryRunner.isReleased) {
          await queryRunner.release();
        }

        if (error instanceof Exception || error instanceof HttpException) {
          throw error;
        }
        if (error?.code) {
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
