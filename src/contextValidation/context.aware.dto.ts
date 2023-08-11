import { Allow } from 'class-validator';
import { EntityManager } from 'typeorm';

export class ContextAwareDto<Body, Query> {
  @Allow()
  context?: {
    body: Body;
    query: Query;
    user?: any;
    runnerManager?: EntityManager;
  };
}
