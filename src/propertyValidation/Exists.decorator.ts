import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  ObjectLiteral,
} from 'typeorm';
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

@ValidatorConstraint({ name: 'IsExistsDb', async: true })
export class ExistsValidation<
  T extends ObjectLiteral,
> extends BaseDbCheckValidation<T> {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
  async validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    this.setDbParams(validationArguments);
    const isExists = await this.runnerManager.exists(this.entity, {
      where: { [this.columnName]: value },
    } as FindManyOptions<T>);
    if (!isExists) {
      if (this.exceptionThrowFunc) {
        this.exceptionThrowFunc(this.columnName);
      }
      return false;
    }
    return true;
  }
}
