import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { ContextBodyQuery, getFindOptionsWhere } from '../../types';
import { ContextTransactionInteceptor } from '../context.interceptor';
import {
	VALIDATION_CONTEXT_OPTIONS,
	ValidationContext,
} from './validation-context-options';

@Injectable()
export class ExistValidationInteceptor<
	Entity extends object,
	Body extends object,
	Query extends object,
> extends ContextTransactionInteceptor<Body, Query> {
	private metadata: ValidationContext<Entity, Body, Query>;
	private throwException: () => never;

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
		next: CallHandler<unknown>,
	): Promise<Observable<unknown>> {
		this.setContext(context);
		this.setFromMetadata(context);
		const findParams = getFindOptionsWhere<Entity, Body, Query>(
			this.metadata.findOptions,
			this.context as ContextBodyQuery<Body, Query>,
		);
		const runnerManager = this.dataSource.createQueryRunner().manager;
		const isExist = await runnerManager.exists(this.metadata.entity, {
			where: findParams,
		});
		if (isExist != this.metadata.isExist) {
			return this.throwException();
		}
		next.handle();
	}
}
