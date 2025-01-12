import { ValidationOptions } from 'class-validator';
import { EntityTarget, ObjectLiteral } from 'typeorm';
import { ExistsValidation } from '../constraints/exist-validation';
import { BaseDbCheck } from './base-db-check.decorator';

export function IsExistsDb<T extends ObjectLiteral>(
	entity: EntityTarget<T>,
	columnName: keyof T,
	exceptionThrowFunc?: (value: any) => never,
	validationOptions?: ValidationOptions,
) {
	return BaseDbCheck(
		ExistsValidation<T>,
		entity,
		columnName,
		[],
		exceptionThrowFunc,
		validationOptions,
	);
}
