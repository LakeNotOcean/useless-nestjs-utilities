import { ExceptionTypeEnum, OpResult } from './Enums';

export abstract class Exception {
  abstract type: ExceptionTypeEnum;
  constructor(
    readonly code: OpResult,
    readonly message: string,
    readonly inner?: any,
  ) {}
}

export abstract class AuthenticationException extends Exception {
  public readonly type = ExceptionTypeEnum.Authentication;
}
export abstract class AuthorizationException extends Exception {
  public readonly type = ExceptionTypeEnum.Authorization;
}

export abstract class ClientException extends Exception {
  public readonly type = ExceptionTypeEnum.Client;
}

export abstract class ServerException extends Exception {
  public readonly type = ExceptionTypeEnum.Server;
}

export abstract class BussinessException extends Exception {
  public readonly type = ExceptionTypeEnum.Business;
}
