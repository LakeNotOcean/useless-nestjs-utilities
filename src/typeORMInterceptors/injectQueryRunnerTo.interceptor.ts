import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  PipeTransform,
  UseInterceptors,
  UsePipes,
  applyDecorators,
} from '@nestjs/common';
import { omit } from 'lodash';
import { Observable } from 'rxjs';
import { TransactionInterceptor } from './transaction.interceptor';

export const QUERY_RUNNER_CONTEXT = '_queryRunnerContext';

@Injectable()
export class InjectQueryRunnerInterceptor implements NestInterceptor {
  constructor(private type?: 'query' | 'body' | 'param') {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (this.type && request[this.type]) {
      request[this.type][QUERY_RUNNER_CONTEXT] =
        request.context.queryRunnerManager;
    }

    return next.handle();
  }
}

@Injectable()
export class StripQueryRunnerContextPipe implements PipeTransform {
  transform(value: any) {
    return omit(value, QUERY_RUNNER_CONTEXT);
  }
}

export function InjectQueryRunnerTo(context: 'query' | 'body' | 'param') {
  return applyDecorators(
    UseInterceptors(
      TransactionInterceptor,
      new InjectQueryRunnerInterceptor(context),
      UsePipes(StripQueryRunnerContextPipe),
    ),
  );
}
