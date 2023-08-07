import { FindOptionsWhere } from 'typeorm';
import { contextBodyParams, contextMapping } from './context.types';
import { getObjectByPath } from './types';

export type rawFindOptions<Entity extends object, Body, Params> = {
  [P in keyof Entity]: contextMapping<Body, Params>;
};

export function getFindOptionsWhere<Entity extends object, Body, Params>(
  options: rawFindOptions<Entity, Body, Params>,
  context: contextBodyParams<Body, Params>,
) {
  const entityObject = {} as Entity;
  for (const key in options) {
    entityObject[key as string] = getObjectByPath<
      contextBodyParams<Body, Params>
    >(context, options[key]);
  }
  return entityObject as FindOptionsWhere<Entity>;
}
