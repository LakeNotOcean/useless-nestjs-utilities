export const OperationsResults: OperationsResultsType = {
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

export type OperationsResultsType = {
	[P in string]?: OperationResultType;
};
