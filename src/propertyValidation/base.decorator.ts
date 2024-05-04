import {
	ValidationDecoratorOptions,
	ValidationOptions,
	ValidatorConstraintInterface,
	registerDecorator,
} from 'class-validator';
import { EntityTarget, ObjectLiteral } from 'typeorm';

export function BaseDbCheckDecorator<T extends ObjectLiteral>(
	// eslint-disable-next-line @typescript-eslint/ban-types
	validator: Function | ValidatorConstraintInterface,
	entity: EntityTarget<T>,
	columnName: keyof T,
	constraints: any[],
	exceptionThrowFunc?: (value: any) => never,
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
