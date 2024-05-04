import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { ContextAwareDto } from './context.aware.dto';

export abstract class ContextInterceptor<
	Body extends object,
	Query extends object,
> implements NestInterceptor
{
	protected context: ContextAwareDto<Body, Query>;
	protected setContext(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		this.context = {
			body: request.body as Body,
			query: request.query as Query,
			user: request.user,
		} as ContextAwareDto<Body, Query>;
	}
	abstract intercept(
		context: ExecutionContext,
		next: CallHandler<unknown>,
	): Promise<Observable<unknown>>;
}

export abstract class ContextTransactionInteceptor<
	Body extends object,
	Query extends object,
> extends ContextInterceptor<Body, Query> {
	constructor(
		protected readonly dataSource: DataSource,
		protected readonly reflector: Reflector,
	) {
		super();
	}
}
