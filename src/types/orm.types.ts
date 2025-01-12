import { FindOptionsWhere } from 'typeorm';
import { ContextBodyQuery, ContextMapping } from './context-types';
import { getObjectByPath } from './get-object-by-path';

export type RawFindOptions<Entity extends object, Body, Query> = {
	[P in keyof Entity]?: ContextMapping<Body, Query>;
};

export function getFindOptionsWhere<Entity extends object, Body, Query>(
	options: RawFindOptions<Entity, Body, Query>,
	context: ContextBodyQuery<Body, Query>,
) {
	const entityObject = {};
	for (const key in options) {
		entityObject[key as string] = getObjectByPath<
			ContextBodyQuery<Body, Query>
		>(context, options[key]);
	}
	return entityObject as FindOptionsWhere<Entity>;
}
