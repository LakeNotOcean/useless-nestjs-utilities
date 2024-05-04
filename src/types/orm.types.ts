import { FindOptionsWhere } from 'typeorm';
import { contextBodyQuery, contextMapping } from './context.types';
import { getObjectByPath } from './types';

export type rawFindOptions<Entity extends object, Body, Query> = {
	[P in keyof Entity]?: contextMapping<Body, Query>;
};

export function getFindOptionsWhere<Entity extends object, Body, Query>(
	options: rawFindOptions<Entity, Body, Query>,
	context: contextBodyQuery<Body, Query>,
) {
	const entityObject = {};
	for (const key in options) {
		entityObject[key as string] = getObjectByPath<
			contextBodyQuery<Body, Query>
		>(context, options[key]);
	}
	return entityObject as FindOptionsWhere<Entity>;
}
