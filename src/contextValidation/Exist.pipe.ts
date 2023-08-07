import { Injectable } from '@nestjs/common';
import { ValidationParamsException } from 'src/exceptions/server.exceptions';
import { getFindOptionsWhere, rawFindOptions } from 'src/types/orm.types';
import { EntityTarget } from 'typeorm';
import { BaseValidationContextPipe } from './base.pipe';

@Injectable()
export class ExistValidationPipe<
  Entity extends object,
  Body,
  Params,
> extends BaseValidationContextPipe<Body, Params> {
  constructor(
    private entity: EntityTarget<Entity>,
    private findOptions: rawFindOptions<Entity, Body, Params>,
  ) {
    super();
  }
  async transform(value: any) {
    this.setContextInfo(value);
    if (!this.contextInfo.context || !this.contextInfo.context.runnerManager) {
      throw new ValidationParamsException({
        message: 'runner manager or context is not provided',
      });
    }
    const findParams = getFindOptionsWhere<Entity, Body, Params>(
      this.findOptions,
      this.contextInfo.context,
    );
    const isExist = await this.contextInfo.context!.runnerManager.exists(
      this.entity,
      findParams,
    );
    if (isExist) {
      return true;
    }
    return false;
  }
}

@Injectable()
export class NotExistValidationPipe<
  Entity extends object,
  Body,
  Params,
> extends BaseValidationContextPipe<Body, Params> {
  constructor(
    private entity: EntityTarget<Entity>,
    private findOptions: rawFindOptions<Entity, Body, Params>,
  ) {
    super();
  }
  async transform(value: any) {
    this.setContextInfo(value);
    if (!this.contextInfo.context || !this.contextInfo.context.runnerManager) {
      throw new ValidationParamsException({
        message: 'runner manager or context is not provided',
      });
    }
    const findParams = getFindOptionsWhere<Entity, Body, Params>(
      this.findOptions,
      this.contextInfo.context,
    );
    const isExist = await this.contextInfo.context!.runnerManager.exists(
      this.entity,
      findParams,
    );
    if (isExist) {
      return false;
    }
    return true;
  }
}
