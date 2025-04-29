import type CurrentUser from "$lib/core/model/currentUser";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { AsyncState } from "$lib/core/types/asyncState";
import { get } from "svelte/store";
import Cookies from 'js-cookie';

export function logout() {
    const currentUser: AsyncState<CurrentUser> = get(currentUserStore);
    if (currentUser.loading === false) return;
    if (currentUser.data === null) return;

    Cookies.delete('accessToken');
    localStorage.removeItem('currentUser');
    currentUserStore.set({
        loading: false,
        data: null,
        error :null
    });
}