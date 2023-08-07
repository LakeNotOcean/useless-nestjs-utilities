import { ValidationError } from 'class-validator';
import { ClientException } from './base.exceptions';
import { OpResult } from './Enums';

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
    super(OpResult.validationError, 'Validation failed!', errors.map(mapError));
  }
}
