import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { contextBodyQuery, contextMapping } from 'src/types/context.types';
import { getObjectByPath } from 'src/types/types';
import { ContextInterceptor } from './context.interceptor';

@Injectable()
export class ContextValidationInteceptor<
  Body extends object,
  Query extends object,
> extends ContextInterceptor<Body, Query> {
  constructor(
    private contextOptions: contextMapping<Body, Query>[],
    private compFunc: (...args: any[]) => void,
  ) {
    super();
  }
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    this.setContext(context);
    this.compFunc(
      ...this.contextOptions.map(option =>
        getObjectByPath<contextBodyQuery<Body, Query>>(
          this.context as contextBodyQuery<Body, Query>,
          option,
        ),
      ),
    );
    return next.handle();
  }
}
