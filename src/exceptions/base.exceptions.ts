import { ExceptionTypeEnum } from './Enums';
import { OperationResultType } from './OperationsResult';

export abstract class Exception {
	abstract type: ExceptionTypeEnum;
	constructor(
		readonly code: OperationResultType,
		readonly payload: ExceptionPayload,
		readonly inner?: any,
	) {}
}

export type ExceptionPayload = {
	message: string;
	[key: string]: any;
};

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

export abstract class NotFoundException extends Exception {
	public readonly type = ExceptionTypeEnum.NotFound;
}

export abstract class ExternalException extends Exception {
	public readonly type = ExceptionTypeEnum.ExternalException;
}
