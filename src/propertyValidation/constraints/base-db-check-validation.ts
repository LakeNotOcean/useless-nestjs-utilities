import {
	ValidationArguments,
	ValidatorConstraintInterface,
} from 'class-validator';
import {
	DataSource,
	EntityManager,
	EntityTarget,
	ObjectLiteral,
} from 'typeorm';
import { ParamsException } from '../../exceptions/params.exception';

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
			throw new ParamsException({
				errorMessage: 'columnName is not provided',
			});
		}
		if (!entity) {
			throw new ParamsException({
				errorMessage: 'entity is not provided',
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
