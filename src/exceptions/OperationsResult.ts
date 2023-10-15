export const BaseOperationsResults: BaseOperationsResultsType = {
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
};

export type OperationResultType = {
	id: number;
	description: string;
};

export type BaseOperationsResultsType = {
	[P in string]?: OperationResultType;
};
