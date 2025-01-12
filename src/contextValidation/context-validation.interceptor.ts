import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getObjectByPath } from '..';
import { ContextBodyQuery, ContextMapping } from '../types';
import { ContextInterceptor } from './context.interceptor';

@Injectable()
export class ContextValidationInteceptor<
	Body extends object,
	Query extends object,
> extends ContextInterceptor<Body, Query> {
	constructor(
		private contextOptions: ContextMapping<Body, Query>[],
		private compFunc: (...args: unknown[]) => void,
	) {
		super();
	}
	async intercept(
		context: ExecutionContext,
		next: CallHandler<unknown>,
	): Promise<Observable<unknown>> {
		this.setContext(context);
		this.compFunc(
			...this.contextOptions.map((option) =>
				getObjectByPath<ContextBodyQuery<Body, Query>>(
					this.context as ContextBodyQuery<Body, Query>,
					option,
				),
			),
		);
		return next.handle();
	}
}
