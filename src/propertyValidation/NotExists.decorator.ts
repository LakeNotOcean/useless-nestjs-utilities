import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import { EntityTarget, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { BaseDbCheckDecorator, BaseDbCheckValidation } from './base.decorator';

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

@ValidatorConstraint({ name: 'IsNotExistsDb', async: true })
export class ExistsValidation<
  T extends ObjectLiteral,
> extends BaseDbCheckValidation<T> {
  async validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    this.setDbParams(validationArguments);
    this.logger.log({
      message: 'check if exists',
      findOptions: this.columnName,
      entity: this.entity,
    });
    const isExists = await this.runnerManager.exists(this.entity, {
      [this.columnName]: value,
    } as FindOptionsWhere<T>);
    if (isExists) {
      if (this.exceptionThrowFunc) {
        this.exceptionThrowFunc(this.columnName);
      }
      return false;
    }
    return true;
  }
}
