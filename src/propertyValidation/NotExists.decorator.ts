import { ValidationOptions } from 'class-validator';
import { EntityTarget, ObjectLiteral } from 'typeorm';
import { BaseDbCheckDecorator } from './base.decorator';
import { NotExistsValidation } from './constraints/not-exist-validation';

export function IsNotExistsDb<T extends ObjectLiteral>(
	entity: EntityTarget<T>,
	columnName: keyof T,
	exceptionThrowFunc?: (value: any) => never,
	validationOptions?: ValidationOptions,
) {
	return BaseDbCheckDecorator(
		NotExistsValidation<T>,
		entity,
		columnName,
		[],
		exceptionThrowFunc,
		validationOptions,
	);
}
