import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { contextBodyQuery } from 'src/types/context.types';
import { getFindOptionsWhere, rawFindOptions } from 'src/types/orm.types';
import { EntityTarget } from 'typeorm';
import { ContextTransactionInteceptor } from './context.interceptor';

@Injectable()
export class NotExistValidationInteceptor<
  Entity extends object,
  Body,
  Query,
> extends ContextTransactionInteceptor<Body, Query> {
  constructor(
    private readonly entity: EntityTarget<Entity>,
    private readonly findOptions: rawFindOptions<Entity, Body, Query>,
    private readonly exceptionThrowFunction: () => never,
  ) {
    super();
  }
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    this.setContext(context);
    const findParams = getFindOptionsWhere<Entity, Body, Query>(
      this.findOptions,
      this.context as contextBodyQuery<Body, Query>,
    );
    const runnerManager = this.dataSource.createQueryRunner().manager;
    const isExist = await runnerManager.exists(this.entity, {
      where: findParams,
    });
    if (isExist) {
      return this.exceptionThrowFunction();
    }
    next.handle();
  }
}
