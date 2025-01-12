import { ServerException } from './base/base-exceptions';
import { baseOperationResults } from './base/base-operation-results';
import { ErrorInfo } from './base/types/error-info.type';

export class InternalException<T extends ErrorInfo> extends ServerException {
	constructor(errorInfo: T) {
		super(
			baseOperationResults.errorInCode,
			{ message: 'internal exception' },
			errorInfo,
		);
	}
}
