import { Allow } from 'class-validator';
import { EntityManager } from 'typeorm';

export class ContextAwareDto<Body, Params> {
  @Allow()
  context?: {
    body: Body;
    params: Params;
    user?: any;
    runnerManager?: EntityManager;
  };
}
