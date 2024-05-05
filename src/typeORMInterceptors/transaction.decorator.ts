import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { QUERY_RUNNER_CONTEXT } from '../lib-constants';

export const TransactionManager = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest();
		return req[QUERY_RUNNER_CONTEXT] as EntityManager;
	},
);
