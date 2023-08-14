import {
  CallHandler,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { contextBodyQuery } from 'src/types/context.types';
import { getFindOptionsWhere, rawFindOptions } from 'src/types/orm.types';
import { DataSource, EntityTarget } from 'typeorm';
import { ContextTransactionInteceptor } from './context.interceptor';

const NOT_EXIST_VALIDATION_OPTIONS = 'not_exist_validation_options';
export const ExistsValidationOptions = <Entity extends object, Body, Query>(
  entity: EntityTarget<Entity>,
  findOptions: rawFindOptions<Entity, Body, Query>,
) => SetMetadata(NOT_EXIST_VALIDATION_OPTIONS, { entity, findOptions });

@Injectable()
export class NotExistValidationInteceptor<
  Entity extends object,
  Body,
  Query,
> extends ContextTransactionInteceptor<Body, Query> {
  private entity: EntityTarget<Entity>;
  private findOptions: rawFindOptions<Entity, Body, Query>;
  private exceptionThrowFunction: () => never;

  constructor(
    readonly dataSource: DataSource,
    readonly reflector: Reflector,
  ) {
    super(dataSource, reflector);
  }
  protected setFromMetadata(context: ExecutionContext) {
    [this.entity, this.findOptions, this.exceptionThrowFunction] =
      this.reflector.get(NOT_EXIST_VALIDATION_OPTIONS, context.getHandler());
  }
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    this.setContext(context);
    this.setFromMetadata(context);
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
