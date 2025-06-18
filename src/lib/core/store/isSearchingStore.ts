import { writable, type Updater, type Writable } from "svelte/store";


function trackedWritable<T>(initialValue: T, name = 'Store') {
    const store = writable(initialValue);
  
    return {
        subscribe: store.subscribe,
        set(value: T) {
            console.log(`[${name}] set called with:`, value);
            console.trace(`[${name}] set called from:`);
            store.set(value);
        },
        update(updater: Updater<T>) {
            console.log(`[${name}] update called`);
            console.trace(`[${name}] update called from:`);
            store.update(updater);
        }
    };
}
  

export const isSearching: Writable<boolean> = writable(false);