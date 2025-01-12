import { baseOperationResults, ErrorInfo } from '../exceptions';
import { ServerException } from '../exceptions/base/base-exceptions';

export class DbException<T extends ErrorInfo> extends ServerException {
	constructor(errorInfo: T) {
		super(
			baseOperationResults.dbException,
			{ message: 'db exception' },
			errorInfo,
		);
	}
}
