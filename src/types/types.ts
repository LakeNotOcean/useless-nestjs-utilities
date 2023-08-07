export const turnIntoEnum = <T extends string, K>(
  opResults: Record<T, number>,
): Record<T, K> => opResults as Record<T, K>;

//example of use
// const OpResultCustomRaw = {
//   foo: 1,
// };
// export const OpResultCustom = turnIntoEnum<
//   keyof typeof OpResultCustomRaw,
//   OpResult
// >(OpResultCustomRaw);

export type NestedKeyOf<T extends object> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : K;
}[keyof T & (string | number)];

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
//   name:string;
//   parameters:{
//       size:number;
//       comments?:string;
//   }
// }
// const fruit={name: 'apple',parameters:{size:1}} as IFruit;

// function printValue<T extends object>(valueObject:T,attribute:NestedKeyOf<T>){
//   console.log(getObjectByPath(valueObject,attribute));
// }

// printValue(fruit,'parameters.size');
