import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { QUERY_RUNNER_CONTEXT } from 'src/constants';
import { EntityManager } from 'typeorm';

export const TransactionManager = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req[QUERY_RUNNER_CONTEXT] as EntityManager;
  },
);
