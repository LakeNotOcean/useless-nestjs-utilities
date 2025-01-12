import { ExceptionType } from '../enum/exception-type.enum';
import { ExceptionPayload } from '../types/exception-payload.type';
import { OperationResult } from '../types/operation-result.type';

export abstract class Exception {
	abstract type: ExceptionType;
	constructor(
		readonly result: OperationResult,
		readonly payload: ExceptionPayload,
		readonly inner?: unknown,
	) {}
}

export abstract class AuthenticationException extends Exception {
	public readonly type = ExceptionType.Authentication;
}
export abstract class AuthorizationException extends Exception {
	public readonly type = ExceptionType.Authorization;
}

export abstract class ClientException extends Exception {
	public readonly type = ExceptionType.Client;
}

export abstract class ServerException extends Exception {
	public readonly type = ExceptionType.Server;
}

export abstract class BussinessException extends Exception {
	public readonly type = ExceptionType.Business;
}

export abstract class NotFoundException extends Exception {
	public readonly type = ExceptionType.NotFound;
}

export abstract class ExternalException extends Exception {
	public readonly type = ExceptionType.ExternalException;
}
