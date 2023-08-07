import { Logger, PipeTransform } from '@nestjs/common';
import { ContextAwareDto } from './context.aware.dto';

export abstract class BaseValidationContextPipe<Body, Params>
  implements PipeTransform<any>
{
  protected readonly logger = new Logger(this.constructor['name']);
  protected contextInfo: ContextAwareDto<Body, Params>;
  abstract transform(value: any);
  setContextInfo(value: any) {
    this.contextInfo = value.context as ContextAwareDto<Body, Params>;
  }
}
