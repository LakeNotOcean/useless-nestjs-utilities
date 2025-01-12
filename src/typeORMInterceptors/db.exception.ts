import { BaseOperationResults } from '../exceptions';
import { ServerException } from '../exceptions/base/base-exceptions';

export class DbException extends ServerException {
	constructor(error: any) {
		super(
			BaseOperationResults['dbException'],
			{ message: 'db exception' },
			createNewDbErrorString(error),
		);
	}
}
export const createNewDbErrorString = (error: any) => {
	return {
		errorCode: error?.code,
		errorDetail: error?.detail,
		errorMessage: error?.message,
	};
};
