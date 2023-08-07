import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
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
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import { ValidationParamsException } from '../exceptions/server.exceptions';
import { REQUEST } from '@nestjs/core';

export function BaseDbCheckDecorator<T extends ObjectLiteral>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  validator: Function | ValidatorConstraintInterface,
  findOptions: FindOptionsWhere<T>,
  entity: EntityTarget<T>,
  constraints: any[],
  exceptionThrowFunc?: (value: any) => never,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [findOptions, entity, exceptionThrowFunc, ...constraints],
      options: validationOptions,
      async: true,
      validator: validator,
    } as ValidationDecoratorOptions);
  };
}

@Injectable({ scope: Scope.REQUEST })
export abstract class BaseDbCheckValidation<T extends ObjectLiteral>
  implements ValidatorConstraintInterface
{
  protected readonly logger = new Logger(this.constructor['name']);
  protected runnerManager: EntityManager;
  protected findOptions: FindOptionsWhere<T>;
  protected entity: EntityTarget<T>;
  protected exceptionThrowFunc?: (value: any) => never | undefined;

  constructor(@Inject(REQUEST) protected request: any) {}
  protected setDbParams(validationArguments: ValidationArguments) {
    this.runnerManager = this.request?.queryRunnerManager as EntityManager;
    if (!this.runnerManager) {
      throw new ValidationParamsException({
        message: 'runner manager is not provided',
      });
    }
    const [findOptions, entity, exceptionThrowFunc] =
      validationArguments.constraints as [
        FindOptionsWhere<T>,
        EntityTarget<T>,
        (value: any) => never | undefined,
      ];
    if (!findOptions) {
      throw new ValidationParamsException({
        message: 'findOptions is not provided',
      });
    }
    if (!entity) {
      throw new ValidationParamsException({
        message: 'entity is not provided',
      });
    }
    this.findOptions = findOptions;
    this.entity = entity;
    this.exceptionThrowFunc = exceptionThrowFunc;
  }
  abstract validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean>;
}
