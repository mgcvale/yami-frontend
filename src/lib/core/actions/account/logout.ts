import type { CurrentUser } from "$lib/core/model/current-user";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { AsyncState } from "$lib/core/model/async-state";
import { get } from "svelte/store";
import Cookies from 'js-cookie';
import { modalStore } from "$lib/core/store/modalStore";

export function logout(intermediateAction: () => void) {
    const currentUser: AsyncState<CurrentUser> = get(currentUserStore);
    if (currentUser.loading) return;
    if (currentUser.data === null) return;

    Cookies.remove('accessToken');
    localStorage.removeItem('currentUser');

    intermediateAction();
    
    currentUserStore.set({
        loading: false,
        data: null,
        error :null
    });
    modalStore.set(null);
}