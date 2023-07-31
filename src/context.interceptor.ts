import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class ContextInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    request.body.context = {
      params: request.params,
      query: request.query,
      user: request.user,
      transactionManager: request.transactionManager,
    };
    return next.handle();
  }
}
