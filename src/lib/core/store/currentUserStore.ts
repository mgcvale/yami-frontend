import { writable, type Writable } from "svelte/store";
import type { CurrentUser } from "$lib";
import type { AsyncState } from "../model/async-state";

export let currentUserStore: Writable<AsyncState<CurrentUser>> = writable({
    loading: true,
    data: null,
    error: null,
});