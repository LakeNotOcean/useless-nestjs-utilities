// Type for internal object properties in stirng format
export type NestedKeyOf<T extends object> = {
	[K in keyof T & (string | number)]: T[K] extends object
		? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
		: K;
}[keyof T & (string | number)];
