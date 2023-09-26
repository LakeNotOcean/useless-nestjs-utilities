# Useless NestJS utilities

## Description

Library for NestJS, that includes mechanisms for handling exceptions, decorators for validation using TypeORM.

## Installation

SOON)))

## Handling exceptions

The package provides a module for error handling - **ExceptionsModule**. How it works? ExceptionModule use abstract class **Exception**, from which special classes of errors are inherited, each of which corresponds to its own code:

- `AuthenticationException` has code 401
- `AuthorizationException` has code 403
- `NotFoundException` has code 404
- `ClientException` has code 400
- `ServerException` has code 500
- `BussinessException` has code 422

First of all set a **BaseInterceptor** when starting the application to catch all IternalExeptions:

```typescript
app.useGlobalInterceptors(
	new ClassSerializerInterceptor(app.get(Reflector)),
	new BaseInterceptor(),
);
```

To handle exceptions correctly, import the module, synchronously or asynchronously, using **formatters** as needed:

Example of use without formatters:

```typescript
@Module({
	imports: [ExceptionsModule.forRoot()],
})
export class AppModule {}
```

Example of use with asynchronous implementation of the exeption translation module with [I18nModule](https://www.npmjs.com/package/nestjs-i18n):

```typescript
@Module({
	imports: [
		ExceptionsModule.forRootAsync({
			inject: [I18nService],
			useFactory: (i18n: I18nService) => ({
				formatters: [new HttpTranslateExceptionFormatter(i18n)],
			}),
		}),
	],
})
export class AppModule {}
```

Exception formatter must implement the interface IExceptionsFormatter, for example:

```typescript
export class HttpTranslateExceptionFormatter implements IExceptionsFormatter {
	constructor(
		@Inject(I18nService)
		private readonly i18nService: I18nService,
	) {}
	match(host: ArgumentsHost): boolean {
		return true;
	}
	format(exception: Exception, host: ArgumentsHost): unknown {
		if (exception instanceof TranslateException) {
			const lang =
				host
					.switchToHttp()
					.getResponse()
					.request.headers['app-language']?.toString() || 'en';
			const message =
				this.i18nService.t(`exeptions.${exception.message}`, {
					args: (exception as TranslateException).args,
					lang: lang,
				}) || 'exeption';

			return new TranslatedException(message);
		}
		return exception;
	}
}
```

You can create a special exeption class for formatters:

```typescript
//for exeptions before translating
export class TranslateException extends BusinessException {
	constructor(
		i18n: string,
		readonly args: object,
	) {
		super(OpResult.translateError, i18n);
	}
}
//for exeptions after translating, can be processed by another formatter
export class TranslatedException extends BusinessException {
	constructor(message: string) {
		super(OpResult.translateError, message);
	}
}
```

And all you have to do is throw an exception in the right place:

```typescript
throw new TranslateException('userAlreadyExists', {});
```

## Transaction manager

**TransactionIterceptor** creates an EntityManager object from [TypeORM](https://www.npmjs.com/package/typeorm), which can be used in all subsequent stages of request processing. Also catches errors (throw **DbException** or InternalException), rolls back and completes transactions.

To use, specify intersection:

```typescript
@UseInterceptors(TransactionInterceptor)
```

To get a manager object, use the decorator in a controller arguments:

```typescript
async updateFruit(
		@Body() body:FruitDto,
		@TransactionManager() entityManager: EntityManager,
	) {
		return await this.fruitService.getFruit(entityManager,body);
	}
```

## Validate property with TypeORM

You can use a decorator to validate a dto property using a db query. For example, you can use the following construction to determine the presence of an id in a database:

```typescript
export class FruitIdDto {
	@IsNotEmpty()
	@IsExistsDb<FruitEntity>(FruitEntity, 'id', () => {
		throw new ValidationException([]);
	})
	id: string;
}
```

The library implements two decorators: **IsExistsDb** and **IsNotExistsDb**. You can implement other decorators in a similar way using **BaseDbCheckDecorator** and **BaseDbCheckValidation**.
WARNING: only use select query.

## Context validation

### Validation without TypeORM

To validate the entire request you can **ContextInterceptor** to set the persistence of the request body and query parameters. For example:

```typescript
@UseInterceptors(
		ContextInterceptor<FruitUpdateBodyDto, FruitQueryDto>
	)
```

After this you can use the context from the request:

```typescript
{
    body: request.body as Body,
    query: request.query as Query,
    user: request.user,
}
```

For example, validate the entire context with **ContextValidationInteceptor**:

```typescript
@UseInterceptors(
		new ContextValidationInteceptor<FruitUpdateBodyDto, FruitQueryDto>(
			['body.weight', 'query.type'],
			(arg1: number, arg2: string) => {
				if (arg1 < 1 && arg2 == 'apple') {
					throw new ValidationException([
						{
							value: 'the apple weighs too little',
							property: 'body.name and body.weight',
						},
					]);
				}
			},
		),
	)
```

### Validation without TypeORM

TODO

## License

MIT
