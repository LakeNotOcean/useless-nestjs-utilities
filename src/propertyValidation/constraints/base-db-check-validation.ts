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
	protected exceptionThrowFunc?: (value: any) => never;

	constructor(readonly dataSource: DataSource) {
		this.runnerManager = dataSource.createQueryRunner().manager;
	}
	protected setDbParams(validationArguments: ValidationArguments) {
		const [entity, columnName, exceptionThrowFunc] =
			validationArguments.constraints as [
				EntityTarget<T>,
				keyof T,
				(value: any) => never,
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
		value: any,
		validationArguments?: ValidationArguments,
	): boolean | Promise<boolean>;
}
