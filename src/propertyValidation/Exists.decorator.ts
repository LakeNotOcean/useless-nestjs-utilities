import { ValidationOptions } from 'class-validator';
import { EntityTarget, ObjectLiteral } from 'typeorm';
import { BaseDbCheckDecorator } from './base.decorator';
import { ExistsValidation } from './constraints/exist-validation';

export function IsExistsDb<T extends ObjectLiteral>(
	entity: EntityTarget<T>,
	columnName: keyof T,
	exceptionThrowFunc?: (value: any) => never,
	validationOptions?: ValidationOptions,
) {
	return BaseDbCheckDecorator(
		ExistsValidation<T>,
		entity,
		columnName,
		[],
		exceptionThrowFunc,
		validationOptions,
	);
}
