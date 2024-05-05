import { SetMetadata } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { rawFindOptions } from '../..';

export const VALIDATION_CONTEXT_OPTIONS = 'validation_context_options';

export const ValidationContextOptions = <Entity extends object, Body, Query>(
	args: ValidationContextType<Entity, Body, Query>,
) => SetMetadata(VALIDATION_CONTEXT_OPTIONS, args);

export type ValidationContextType<Entity extends object, Body, Query> = {
	entity: EntityTarget<Entity>;
	findOptions: rawFindOptions<Entity, Body, Query>;
	isExist: boolean;
	exceptionThrowFunction: () => never;
};
