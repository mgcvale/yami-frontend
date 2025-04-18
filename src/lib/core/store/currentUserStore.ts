import { writable, type Writable } from "svelte/store";
import type { CurrentUser } from "$lib";

export let currentUserStore: Writable<CurrentUser | null> = writable(null);