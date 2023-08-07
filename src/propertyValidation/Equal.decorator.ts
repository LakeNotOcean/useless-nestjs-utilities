import { ValidationOptions, ValidationArguments } from 'class-validator';
import { ObjectLiteral, EntityTarget, FindOptionsWhere } from 'typeorm';
import { BaseDbCheckDecorator, BaseDbCheckValidation } from './base.decorator';

export function Equal<T extends ObjectLiteral>(
  columnName: keyof T,
  findOptions: FindOptionsWhere<T>,
  entity: EntityTarget<T>,
  exceptionThrowFunc?: (value: any) => never,
  validationOptions?: ValidationOptions,
) {
  return BaseDbCheckDecorator(
    EqualValidation<T>,
    findOptions,
    entity,
    [columnName],
    exceptionThrowFunc,
    validationOptions,
  );
}

export class EqualValidation<
  T extends ObjectLiteral,
> extends BaseDbCheckValidation<T> {
  async validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    this.setDbParams(validationArguments);
    this.logger.log({
      message: 'check if exists',
      findOptions: this.findOptions,
      entity: this.entity,
    });
    const dbResult = await this.runnerManager.findOneBy(
      this.entity,
      this.findOptions,
    );
    const columnName = validationArguments.constraints[
      validationArguments.constraints.length - 1
    ] as string;
    const isEqual =
      dbResult && dbResult[columnName] == validationArguments.value
        ? true
        : false;
    if (!isEqual) {
      if (this.exceptionThrowFunc) {
        this.exceptionThrowFunc(value);
      }
      return false;
    }
    return true;
  }
}
