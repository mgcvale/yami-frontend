import { writable, type Writable } from "svelte/store";

export const isSearching: Writable<boolean> = writable(false);