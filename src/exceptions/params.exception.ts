import { ErrorInfo } from './base/types/error-info.type';
import { InternalException } from './server.exception';

export type ParamsExceptionOptions = Pick<ErrorInfo, 'errorMessage'>;

export class ParamsException extends InternalException<ParamsExceptionOptions> {
	constructor(options: ParamsExceptionOptions) {
		super(options);
	}
}
