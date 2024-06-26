import { ValidationArguments, ValidatorConstraint } from 'class-validator';
import { DataSource, FindManyOptions, ObjectLiteral } from 'typeorm';
import { BaseDbCheckValidation } from './base-db-check-validation';

@ValidatorConstraint({ name: 'IsNotExistsDb', async: true })
export class NotExistsValidation<
	T extends ObjectLiteral,
> extends BaseDbCheckValidation<T> {
	constructor(dataSource: DataSource) {
		super(dataSource);
	}
	async validate(
		value: string | number | symbol,
		validationArguments: ValidationArguments,
	): Promise<boolean> {
		this.setDbParams(validationArguments);

		const isExists = await this.runnerManager.exists(this.entity, {
			where: { [this.columnName]: value },
		} as FindManyOptions<T>);
		if (isExists) {
			if (this.exceptionThrowFunc) {
				this.exceptionThrowFunc(this.columnName);
			}
			return false;
		}
		return true;
	}
}
