import { type Writable, writable } from 'svelte/store';
import type { Component } from 'svelte';

export interface ModalConfig {
  component: Component;
  props?: Record<string, any>;
}

export const modalStore: Writable<ModalConfig | null> = writable(null);