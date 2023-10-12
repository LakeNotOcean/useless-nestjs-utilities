import { ValidationError } from 'class-validator';
import { OperationsResults } from './OperationsResult';
import { ClientException } from './base.exceptions';

export interface RequestValidationError {
	properties: string[];
	errors: { [key: string]: string } | undefined;
	nested?: RequestValidationError[] | undefined;
}

const mapError = (error: ValidationError): RequestValidationError => ({
	properties: [error.property],
	errors: error.constraints,
	nested: error.children?.map(mapError),
});

export class ValidationException extends ClientException {
	constructor(errors: ValidationError[]) {
		super(OperationsResults['validationException'], {
			message: 'Validation failed',
			inner: errors.map(mapError),
		});
	}
}
