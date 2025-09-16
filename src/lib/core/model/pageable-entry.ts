import { isArrayOf, verifyObject } from "./type-checkers";

export interface PageableEntry<T> {
    content: T[],
    totalPages: number,
    totalElements: number,
    last: boolean,
    numberOfElements: number,
    size: number,
    number: 0,
    sort: {
        sorted: boolean,
        unsorted: boolean,
        empty: true,
    },
    first: boolean,
    empty: boolean
};

export function isPageableEntry<T>(
  data: any,
  tTypeChecker: (t: any) => t is T
): data is PageableEntry<T> {
  const schema: Record<keyof Omit<PageableEntry<T>, 'content'>, string> = {
    totalPages: 'number',
    totalElements: 'number',
    last: 'boolean',
    numberOfElements: 'number',
    size: 'number',
    number: 'number',
    sort: 'object',
    first: 'boolean',
    empty: 'boolean',
  };

  const sortSchema: Record<keyof PageableEntry<T>['sort'], string> = {
    sorted: 'boolean',
    unsorted: 'boolean',
    empty: 'boolean',
  };

  if (!data || typeof data !== 'object' || !isArrayOf(data.content, tTypeChecker)) {
    console.log("Failed array check");
    
    return false;
  }

  if (!data.sort || !verifyObject(data.sort, sortSchema)) {
    return false;
  }

  return verifyObject(data, schema);
}