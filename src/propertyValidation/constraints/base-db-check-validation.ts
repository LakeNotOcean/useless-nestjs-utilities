import {
	ValidationArguments,
	ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationParamsException } from 'src/exceptions/server.exceptions';
import {
	DataSource,
	EntityManager,
	EntityTarget,
	ObjectLiteral,
} from 'typeorm';

export abstract class BaseDbCheckValidation<T extends ObjectLiteral>
	implements ValidatorConstraintInterface
{
	protected runnerManager: EntityManager;
	protected entity: EntityTarget<T>;
	protected columnName: keyof T;
	protected exceptionThrowFunc?: (value: string | number | symbol) => never;

	constructor(readonly dataSource: DataSource) {
		this.runnerManager = dataSource.createQueryRunner().manager;
	}
	protected setDbParams(validationArguments: ValidationArguments) {
		const [entity, columnName, exceptionThrowFunc] =
			validationArguments.constraints as [
				EntityTarget<T>,
				keyof T,
				(value: string | number | symbol) => never,
			];
		if (!columnName) {
			throw new ValidationParamsException({
				message: 'columnName is not provided',
			});
		}
		if (!entity) {
			throw new ValidationParamsException({
				message: 'entity is not provided',
			});
		}
		this.entity = entity;
		this.exceptionThrowFunc = exceptionThrowFunc;
		this.columnName = columnName;
	}
	abstract validate(
		value: string | number | symbol,
		validationArguments?: ValidationArguments,
	): boolean | Promise<boolean>;
}
