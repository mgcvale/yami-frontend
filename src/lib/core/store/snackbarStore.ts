import type { Component } from "svelte";
import { writable, type Writable } from "svelte/store";

export interface SnackbarConfig {
    component: Component;
    props?: Record<string, any>;
}

export const snackbarStore: Writable<SnackbarConfig | null> = writable(null);