export enum ExceptionTypeEnum {
  Server = 'server',
  Authentication = 'authentication',
  Authorization = 'authorization',
  Client = 'client',
  Business = 'business',
  Custom = 'custom',
  NotFound = 'not_found',
}

export enum OpResult {
  errorInCode,
  validationError,
  dbError,
}
