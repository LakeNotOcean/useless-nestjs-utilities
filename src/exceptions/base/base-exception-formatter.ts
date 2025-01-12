import { ArgumentsHost } from '@nestjs/common';
import { Exception } from './base-exceptions';

export interface ExceptionsFormatterInterface {
	format(exception: unknown, host: ArgumentsHost): unknown;

	match(host: ArgumentsHost): boolean;
}

export class BaseExceptionFormatter implements ExceptionsFormatterInterface {
	match(_host: ArgumentsHost): boolean {
		return true;
	}
	format(exception: Exception, _host: ArgumentsHost): unknown {
		return exception;
	}
}
