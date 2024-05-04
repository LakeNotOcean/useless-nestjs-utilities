import { NestedKeyOf } from './types';

// type for request body and query string parameters
export type contextBodyQuery<Body, Query> = {
	body: Body;
	query: Query;
};

// type for keys in "NestedKeyOf" format
export type contextMapping<Body, Query> = NestedKeyOf<
	contextBodyQuery<Body, Query>
>;
