import { ValidationOptions } from 'class-validator';
import { EntityTarget, ObjectLiteral } from 'typeorm';
import { NotExistsValidation } from '../constraints/not-exist-validation';
import { BaseDbCheck } from './base-db-check.decorator';

export function IsNotExistsDb<T extends ObjectLiteral>(
	entity: EntityTarget<T>,
	columnName: keyof T,
	exceptionThrowFunc?: (value: any) => never,
	validationOptions?: ValidationOptions,
) {
	return BaseDbCheck(
		NotExistsValidation<T>,
		entity,
		columnName,
		[],
		exceptionThrowFunc,
		validationOptions,
	);
}
