import { Injectable } from '@nestjs/common';
import { ValidationParamsException } from 'src/exceptions/server.exceptions';
import { contextBodyParams, contextMapping } from 'src/types/context.types';
import { getObjectByPath } from 'src/types/types';
import { BaseValidationContextPipe } from './base.pipe';

@Injectable()
export class ContextValidationPipe<
  Body,
  Params,
> extends BaseValidationContextPipe<Body, Params> {
  constructor(
    private contextOptions: contextMapping<Body, Params>[],
    private compFunc: (...args: any[]) => boolean,
  ) {
    super();
  }
  async transform(value: any) {
    this.setContextInfo(value);
    if (!this.contextInfo.context) {
      throw new ValidationParamsException({
        message: 'context is not provided',
      });
    }
    return this.compFunc(
      ...this.contextOptions.map(option =>
        getObjectByPath<contextBodyParams<Body, Params>>(
          this.contextInfo as contextBodyParams<Body, Params>,
          option,
        ),
      ),
    );
  }
}
