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

export function IsNotExistsDb<T extends ObjectLiteral>(
  entity: EntityTarget<T>,
  columnName: keyof T,
  exceptionThrowFunc?: (value: any) => never,
  validationOptions?: ValidationOptions,
) {
  return BaseDbCheckDecorator(
    NotExistsValidation<T>,
    entity,
    columnName,
    [],
    exceptionThrowFunc,
    validationOptions,
  );
}

@ValidatorConstraint({ name: 'IsNotExistsDb', async: true })
export class NotExistsValidation<
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
    if (isExists) {
      if (this.exceptionThrowFunc) {
        this.exceptionThrowFunc(this.columnName);
      }
      return false;
    }
    return true;
  }
}
