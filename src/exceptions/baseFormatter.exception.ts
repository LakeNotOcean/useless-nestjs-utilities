import { ArgumentsHost } from '@nestjs/common';
import { Exception } from './base.exceptions';

export interface IExceptionsFormatter {
  format(exception: unknown, host: ArgumentsHost): unknown;

  match(host: ArgumentsHost): boolean;
}

export class BaseExceptionFomratter implements IExceptionsFormatter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  match(host: ArgumentsHost): boolean {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  format(exception: Exception, host: ArgumentsHost): unknown {
    return exception;
  }
}
