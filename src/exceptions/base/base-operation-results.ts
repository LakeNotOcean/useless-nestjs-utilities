import { OperationResult } from '../types/operation-result.type';

export type BaseOperationResults =
	| 'dbException'
	| 'errorInCode'
	| 'validationException';

export const baseOperationResults: Record<
	BaseOperationResults,
	OperationResult
> = {
	errorInCode: {
		id: 0,
		description: 'error in code',
	},
	validationException: {
		id: 1,
		description: 'validation exception',
	},
	dbException: {
		id: 2,
		description: 'db exception',
	},
} as const;
