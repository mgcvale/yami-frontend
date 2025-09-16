import type { SyncState } from "$lib/core/model/sync-state";

export function searchRune<T>(searchFunction: (query: string) => Promise<SyncState<T>>) {
    let results = $state<SyncState<T> | null>(null);
    let isLoading = $state(false);
    let lastQuery = $state<string>('');

    async function search(query: string) {
        if (!query.trim()) {
            results = null;
            lastQuery = '';
            return;
        }

        isLoading = true;
        lastQuery = query;
        
        try {
            results = await searchFunction(query);
        } finally {
            isLoading = false;
        }
    }

    function clear() {
        results = null;
        lastQuery = '';
        isLoading = false;
    }

    return {
        get results() { return results; },
        get isLoading() { return isLoading; },
        get lastQuery() { return lastQuery; },
        search,
        clear
    };
}