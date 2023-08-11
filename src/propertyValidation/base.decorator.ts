import {
  ValidationArguments,
  ValidationDecoratorOptions,
  ValidationOptions,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';
import { ValidationParamsException } from '../exceptions/server.exceptions';

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

export abstract class BaseDbCheckValidation<T extends ObjectLiteral>
  implements ValidatorConstraintInterface
{
  protected runnerManager: EntityManager;
  protected entity: EntityTarget<T>;
  protected columnName: keyof T;
  protected exceptionThrowFunc?: (value: any) => never | undefined;

  constructor(readonly dataSource: DataSource) {
    this.runnerManager = dataSource.createQueryRunner().manager;
  }
  protected setDbParams(validationArguments: ValidationArguments) {
    const [entity, columnName, exceptionThrowFunc] =
      validationArguments.constraints as [
        EntityTarget<T>,
        keyof T,
        (value: any) => never | undefined,
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
