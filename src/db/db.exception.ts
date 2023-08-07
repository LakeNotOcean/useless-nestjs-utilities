import { OpResult } from 'src/exceptions/Enums';
import { ServerException } from '../exceptions/base.exceptions';

export class DbException extends ServerException {
  constructor(error: any) {
    super(OpResult.dbError, 'db error', createNewDbErrorString(error));
  }
}
export const createNewDbErrorString = (error: any) => {
  return {
    errorCode: error?.code,
    errorDetail: error?.detail,
    errorMessage: error?.message,
  };
};
