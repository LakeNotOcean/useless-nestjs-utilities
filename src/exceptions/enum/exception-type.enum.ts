export const ExceptionType = {
	Server: 'server',
	Authentication: 'authentication',
	Authorization: 'authorization',
	Client: 'client',
	Business: 'business',
	Custom: 'custom',
	NotFound: 'not_found',
	ExternalException: 'external_exception',
} as const;

export type ExceptionType = (typeof ExceptionType)[keyof typeof ExceptionType];
