import { SetMetadata } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { RawFindOptions } from '../..';

export const VALIDATION_CONTEXT_OPTIONS = 'validation_context_options';

export const ValidationContextOptions = <Entity extends object, Body, Query>(
	args: ValidationContext<Entity, Body, Query>,
) => SetMetadata(VALIDATION_CONTEXT_OPTIONS, args);

export type ValidationContext<Entity extends object, Body, Query> = {
	entity: EntityTarget<Entity>;
	findOptions: RawFindOptions<Entity, Body, Query>;
	isExist: boolean;
	throwException: () => never;
};
