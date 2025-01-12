import {
	ArgumentsHost,
	Catch,
	DynamicModule,
	ExceptionFilter,
	Inject,
	Logger,
	Module,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { FORMATTERS_OPTIONS } from '../lib-constants';
import {
	BaseExceptionFormatter,
	ExceptionsFormatterInterface,
} from './base/base-exception-formatter';
import { Exception } from './base/base-exceptions';
import {
	ExceptionsModuleAsyncOptions,
	ExceptionsModuleOptions,
} from './base/types/exception-options.type';
import { ExceptionType } from './enum/exception-type.enum';

@Module({})
export class ExceptionsModule {
	public static forRoot(options: ExceptionsModuleOptions): DynamicModule {
		return {
			module: ExceptionsModule,
			providers: [
				{
					provide: APP_FILTER,
					useClass: GlobalExceptionsFilter,
				},
				{
					provide: FORMATTERS_OPTIONS,
					useValue: options,
				},
			],
		};
	}
	public static forRootAsync(options: ExceptionsModuleAsyncOptions) {
		return {
			module: ExceptionsModule,
			imports: options.imports,
			providers: [
				{
					provide: APP_FILTER,
					useClass: GlobalExceptionsFilter,
					useFactory: undefined,
				},
				{
					provide: FORMATTERS_OPTIONS,
					useFactory: options.useFactory,
					inject: options.inject,
				},
			],
		};
	}
}

const typesMap = new Map<string, number>()
	.set(ExceptionType.Authentication, 401)
	.set(ExceptionType.Authorization, 403)
	.set(ExceptionType.NotFound, 404)
	.set(ExceptionType.Business, 422)
	.set(ExceptionType.Client, 400)
	.set(ExceptionType.Server, 500)
	.set(ExceptionType.ExternalException, 502);

@Catch(Exception)
export class GlobalExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger('ERROR');
	private readonly formatters: ExceptionsFormatterInterface[];
	private readonly baseFormatter = new BaseExceptionFormatter();
	constructor(
		@Inject(FORMATTERS_OPTIONS)
		options: ExceptionsModuleOptions,
	) {
		this.formatters = options?.formatters || [];
		if (this.formatters.length < 1) {
			this.formatters = [];
		}
	}

	catch(
		exception: Exception,
		argumentsHost: ArgumentsHost,
	): Observable<unknown> {
		this.logger.error(exception);
		const formatter = this.formatters.find((x) => x.match(argumentsHost));
		const payload =
			formatter?.format(exception, argumentsHost) ||
			this.baseFormatter.format(exception, argumentsHost);

		if (argumentsHost.getType() === 'http') {
			const request = argumentsHost.switchToHttp().getResponse();
			const status = typesMap.get(exception.type) || 500;
			if (request.status) {
				request?.status(status).send(payload);
			}
			return EMPTY;
		}
		return throwError(() => payload);
	}
}
