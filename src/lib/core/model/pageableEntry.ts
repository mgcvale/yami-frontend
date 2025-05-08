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