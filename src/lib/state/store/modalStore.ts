import { type Writable, writable } from 'svelte/store';
import type { Component } from "svelte";

export const modalStore: Writable<Component | null> = writable(null);
