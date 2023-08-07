import { NestedKeyOf } from './types';

export type contextBodyParams<Body, Params> = {
  body: Body;
  params: Params;
};

export type contextMapping<Body, Params> = NestedKeyOf<
  contextBodyParams<Body, Params>
>;
