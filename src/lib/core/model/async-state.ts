
export type AsyncState<T> = {
    loading: boolean;
    error: App.Error | null;
    data: T | null;
};
