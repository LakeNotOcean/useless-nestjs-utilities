import { OperationsResults } from 'src/exceptions/OperationsResult';
import { ServerException } from '../exceptions/base.exceptions';

export class DbException extends ServerException {
	constructor(error: any) {
		super(
			OperationsResults['dbException'],
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
