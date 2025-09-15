import type { SyncState } from "../model/sync-state";

export interface AsyncOperation<T = any> {
    readonly isLoading: boolean;
    readonly response: SyncState<T>;
    execute(): Promise<void>;
    reset(): void;
}

export function createAsyncOperation<T>(operation: () => Promise<SyncState<T>>): AsyncOperation<T> {
    let isLoading = $state(false);
    let response = $state<SyncState<T>>({data: null, error: null});

    async function execute() {
        isLoading = true;
        
        try {
            response = await operation();
        } finally {
            isLoading = false;
        }
    }

    function reset() {
        isLoading = false;
        response = {data: null, error: null} as SyncState<T>;
    }

    return {
        get isLoading() { return isLoading; },
        get response() { return response },
        execute,
        reset
    };
}