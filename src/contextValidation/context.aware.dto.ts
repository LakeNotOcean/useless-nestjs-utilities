import { Allow } from 'class-validator';
import { EntityManager } from 'typeorm';

export class ContextAwareDto<Body extends object, Query extends object> {
	@Allow()
	context?: {
		body: Body;
		query: Query;
		user?: unknown;
		runnerManager?: EntityManager;
	};
}
