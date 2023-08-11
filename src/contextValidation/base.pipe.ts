import { PipeTransform } from '@nestjs/common';
import { ValidationParamsException } from 'src/exceptions/server.exceptions';
import { ContextAwareDto } from './context.aware.dto';

export abstract class BaseValidationContextPipe<Body, Query>
  implements PipeTransform<any>
{
  protected contextInfo: ContextAwareDto<Body, Query>;
  abstract transform(value: any);
  setContextInfo(value: any) {
    if (!value.context) {
      throw new ValidationParamsException({
        message: 'context is not provided',
      });
    }
    this.contextInfo = value.context as ContextAwareDto<Body, Query>;
  }
}
