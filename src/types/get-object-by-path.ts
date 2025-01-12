import { NestedKeyOf } from './nested-key-of.type';

// Get object property by string in "NestedKeyOf" format
export function getObjectByPath<T extends object>(
	obj: T,
	path: NestedKeyOf<T>,
) {
	const keys = (path as string).split('.');
	let result = obj as object;
	for (const key of keys) {
		result = result[key as keyof typeof result];
		if (!result) {
			return result;
		}
	}
	return result;
}

//example of use
// interface IFruit {
// 	name: string;
// 	parameters: {
// 		size: number;
// 		comments?: string;
// 	};
// }
// const fruit: IFruit = { name: 'apple', parameters: { size: 1 } };

// function printValue<T extends object>(
// 	valueObject: T,
// 	attribute: NestedKeyOf<T>,
// ) {
// 	console.log(getObjectByPath(valueObject, attribute));
// }

// printValue(fruit, 'parameters.size');
