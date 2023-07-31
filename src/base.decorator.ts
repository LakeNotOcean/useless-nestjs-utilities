import { Logger } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationDecoratorOptions,
  ValidationOptions,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  ObjectLiteral,
} from 'typeorm';
import { TransactionManager } from './transaction.decorator';

export function Exists<T extends ObjectLiteral>(
  findOptions: FindManyOptions<T>,
  entity: EntityTarget<T>,
  exceptionThrowFunc?: (value: any) => never,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [findOptions, entity, exceptionThrowFunc],
      options: validationOptions,
      async: true,
      validator: ExistsValidation<T>,
    } as ValidationDecoratorOptions);
  };
}

export class ExistsValidation<T extends ObjectLiteral>
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly logger: Logger,
    @TransactionManager()
    private readonly runnerManager: EntityManager,
  ) {}
  async validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const [findOptions, entity, exceptionThrowFunc] =
      validationArguments.constraints as [
        FindManyOptions<T>,
        EntityTarget<T>,
        (value: any) => never | undefined,
      ];
    this.logger.log({ message: 'check if exists' });
    const isExists = await this.runnerManager.exists(entity, findOptions);
    if (isExists) {
      if (exceptionThrowFunc) {
        exceptionThrowFunc(value);
      }
      return false;
    }
    return true;
  }
}
