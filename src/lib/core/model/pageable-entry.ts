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
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.content) &&
    data.content.every(tTypeChecker) &&
    typeof data.totalPages === 'number' &&
    typeof data.totalElements === 'number' &&
    typeof data.last === 'boolean' &&
    typeof data.numberOfElements === 'number' &&
    typeof data.size === 'number' &&
    typeof data.number === 'number' &&
    typeof data.sort === 'object' &&
    data.sort !== null &&
    typeof data.sort.sorted === 'boolean' &&
    typeof data.sort.unsorted === 'boolean' &&
    typeof data.sort.empty === 'boolean' &&
    typeof data.first === 'boolean' &&
    typeof data.empty === 'boolean'
  );
}
