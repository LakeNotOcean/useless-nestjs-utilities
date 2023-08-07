import { OpResult } from './Enums';
import { ServerException } from './base.exceptions';

export class InternalException extends ServerException {
  constructor(error: any) {
    super(OpResult.errorInCode, `internal error`, {
      errorCode: error?.code,
      errorMessage: error?.message,
      errorDetail: error?.detail,
    });
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
