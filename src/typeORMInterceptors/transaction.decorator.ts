import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { QUERY_RUNNER_CONTEXT } from '../lib-constants';

export const TransactionManager = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request[QUERY_RUNNER_CONTEXT] as EntityManager;
	},
);
