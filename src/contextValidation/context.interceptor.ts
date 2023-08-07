import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EntityManager } from 'typeorm';
import { ContextAwareDto } from './context.aware.dto';

export class ContextInterceptor<T1, T2> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    request.body.context = {
      body: request.body as T1,
      params: request.params as T2,
      user: request.user,
      transactionManager: request.queryRunnerManager as EntityManager,
    } as ContextAwareDto<T1, T2>;
    return next.handle();
  }
}
