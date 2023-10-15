import { BaseOperationsResults } from './OperationsResult';
import { ServerException } from './base.exceptions';

export class InternalException extends ServerException {
	constructor(error: any) {
		super(
			BaseOperationsResults['dbException'],
			{ message: 'iternal exception' },
			{
				errorCode: error?.code,
				errorMessage: error?.message,
				errorDetail: error?.detail,
			},
		);
	}
}

export interface IValidationParamsInnerException {
	message: string;
}

export class ValidationParamsException extends InternalException {
	constructor(error: IValidationParamsInnerException) {
		super(error);
	}
}
