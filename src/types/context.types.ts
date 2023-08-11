import { NestedKeyOf } from './types';

export type contextBodyQuery<Body, Query> = {
  body: Body;
  query: Query;
};

export type contextMapping<Body, Query> = NestedKeyOf<
  contextBodyQuery<Body, Query>
>;
