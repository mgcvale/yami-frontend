import type { CurrentUser } from "$lib/core/model/current-user";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { AsyncState } from "$lib/core/model/async-state";
import { get } from "svelte/store";
import Cookies from 'js-cookie';
import { modalStore } from "$lib/core/store/modalStore";
import { snackbarStore } from "$lib/core/store/snackbarStore";
import { invalidate } from "$app/navigation";

export function logout(intermediateAction: () => void, invlaidateCurrentUser=false) {
    const currentUser: AsyncState<CurrentUser> = get(currentUserStore);
    if (currentUser.loading) return;
    if (currentUser.data === null) return;
    Cookies.remove('accessToken');
    localStorage.removeItem('currentUser');
    if (invlaidateCurrentUser) invalidate("user:current");

    intermediateAction();

    currentUserStore.set({
        loading: false,
        data: null,
        error :null
    });

    snackbarStore.set(null);
    modalStore.set(null);
}