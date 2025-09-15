export type SyncState<T> = {
    error: App.Error | null;
    data: T | null;
};
