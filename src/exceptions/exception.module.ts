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
import { ExceptionTypeEnum } from './Enums';
import { Exception } from './base.exceptions';
import {
	BaseExceptionFomratter,
	IExceptionsFormatter,
} from './baseFormatter.exception';
import {
	ExceptionsModuleAsyncOptions,
	ExceptionsModuleOptions,
} from './exceptionOptions.type';

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
					provide: 'FORMATTERS_OPTIONS',
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
					provide: 'FORMATTERS_OPTIONS',
					useFactory: options.useFactory,
					inject: options.inject,
				},
			],
		};
	}
}

const typesMap = new Map<string, number>()
	.set(ExceptionTypeEnum.Authentication, 401)
	.set(ExceptionTypeEnum.Authorization, 403)
	.set(ExceptionTypeEnum.NotFound, 404)
	.set(ExceptionTypeEnum.Business, 422)
	.set(ExceptionTypeEnum.Client, 400)
	.set(ExceptionTypeEnum.Server, 500);

@Catch(Exception)
export class GlobalExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger('ERROR');
	private readonly formatters: IExceptionsFormatter[];
	private readonly baseFormatter = new BaseExceptionFomratter();
	constructor(
		@Inject('FORMATTERS_OPTIONS')
		private readonly options: ExceptionsModuleOptions,
	) {
		this.formatters = options?.formatters || [];
		if (this.formatters.length < 1) {
			this.formatters = [];
		}
	}

	catch(exception: Exception, argumentsHost: ArgumentsHost): Observable<any> {
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
