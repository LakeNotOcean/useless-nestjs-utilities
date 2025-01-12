import { NestedKeyOf } from './nested-key-of.type';

// type for request body and query string parameters
export type ContextBodyQuery<Body, Query> = {
	body: Body;
	query: Query;
};

// type for keys in "NestedKeyOf" format
export type ContextMapping<Body, Query> = NestedKeyOf<
	ContextBodyQuery<Body, Query>
>;
