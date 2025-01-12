import {
	ValidationDecoratorOptions,
	ValidationOptions,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator';
import { EntityTarget, ObjectLiteral } from 'typeorm';

export function BaseDbCheck<T extends ObjectLiteral>(
	validator: object | ValidatorConstraintInterface,
	entity: EntityTarget<T>,
	columnName: keyof T,
	constraints: any[],
	exceptionThrowFunc?: (value: string | number | symbol) => never,
	validationOptions?: ValidationOptions,
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			constraints: [entity, columnName, exceptionThrowFunc, ...constraints],
			options: validationOptions,
			async: true,
			validator: validator,
		} as ValidationDecoratorOptions);
	};
}
