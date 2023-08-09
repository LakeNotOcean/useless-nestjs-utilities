import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EntityManager } from 'typeorm';

export const TransactionManager = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.context.queryRunnerManager as EntityManager;
  },
);
