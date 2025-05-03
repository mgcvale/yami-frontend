import { browser } from "$app/environment";
import config from "$lib/config";
import type CurrentUser from "$lib/core/model/currentUser"
import { isCurrentUser } from "$lib/core/model/currentUser";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import Cookies from 'js-cookie';

export function load() {
    if (!browser) return;

    currentUserStore.set({
        loading: true,
        data: null,
        error: null,
    });

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
        currentUserStore.set({
            loading: false,
            data: null,
            error: null
        });
        localStorage.removeItem("currentUser");
        return;
    }

    const cachedUser = localStorage.getItem("currentUser");
    if (cachedUser) {
        try {
            const cachedUserJso = JSON.parse(cachedUser);
            console.log("Ended partial loading from token; no user found because not token was present");
            if (isCurrentUser(cachedUserJso)) {
                currentUserStore.set({
                    loading: false,
                    data: cachedUserJso,
                    error: null,
                });
            }
        } catch (e) {
            localStorage.removeItem("currentUser");
        }
    }

    fetch(config.apiPaths.login(), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(json => {
                throw {
                    status: res.status,
                    json: json,
                } as ErrorResponse;
            });
        }
        return res.json();
    }).then(data => {
        currentUserStore.set({
            loading: false,
            data: (data as CurrentUser),
            error: null,
        });
        localStorage.setItem("currentUser", JSON.stringify(data));
    }).catch(error => {
        Cookies.remove("accessToken");
        currentUserStore.set({
            loading: false,
            data: null,
            error: error
        });
        localStorage.removeItem("currentUser");
    });

}