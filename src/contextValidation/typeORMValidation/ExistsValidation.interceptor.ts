import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { contextBodyQuery } from 'src/types/context.types';
import { getFindOptionsWhere } from 'src/types/orm.types';
import { DataSource } from 'typeorm';
import { ContextTransactionInteceptor } from '../context.interceptor';
import {
	VALIDATION_CONTEXT_OPTIONS,
	ValidationContextType,
} from './validationContextOptions';

@Injectable()
export class ExistValidationInteceptor<
	Entity extends object,
	Body extends object,
	Query extends object,
> extends ContextTransactionInteceptor<Body, Query> {
	private metadata: ValidationContextType<Entity, Body, Query>;
	private exceptionThrowFunction: () => never;

	constructor(
		readonly dataSource: DataSource,
		readonly reflector: Reflector,
	) {
		super(dataSource, reflector);
	}
	protected setFromMetadata(context: ExecutionContext) {
		this.metadata = this.reflector.get(
			VALIDATION_CONTEXT_OPTIONS,
			context.getHandler(),
		);
	}
	async intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Promise<Observable<any>> {
		this.setContext(context);
		this.setFromMetadata(context);
		const findParams = getFindOptionsWhere<Entity, Body, Query>(
			this.metadata.findOptions,
			this.context as contextBodyQuery<Body, Query>,
		);
		const runnerManager = this.dataSource.createQueryRunner().manager;
		const isExist = await runnerManager.exists(this.metadata.entity, {
			where: findParams,
		});
		if (isExist != this.metadata.isExist) {
			return this.exceptionThrowFunction();
		}
		next.handle();
	}
}
