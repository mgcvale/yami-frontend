import { browser } from "$app/environment";
import config from "$lib/config";
import type CurrentUser from "$lib/core/model/currentUser"
import { isCurrentUser } from "$lib/core/model/currentUser";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import type { ErrorResponse } from "$lib/core/types/errorResponse";
import Cookies from 'js-cookie';

export function load() {
    if (!browser) return;

    console.log("loading from token");
    currentUserStore.set({
        loading: true,
        data: null,
        error: null,
    });

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
        console.log("Ended loading from token; no user found because not token was present");
        currentUserStore.set({
            loading: false,
            data: null,
            error: null
        });
        localStorage.removeItem("currentUser");
        console.log("not loaded due to missing cookie");
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
        console.log("finished loading form API call, success");
        currentUserStore.set({
            loading: false,
            data: (data as CurrentUser),
            error: null,
        });
        localStorage.setItem("currentUser", JSON.stringify(data));
        console.log("updated from API call: ", localStorage.getItem("currentUser"));
    }).catch(error => {
        console.log("finished loading from api call; error");
        Cookies.remove("accessToken");
        currentUserStore.set({
            loading: false,
            data: null,
            error: error
        });
        localStorage.removeItem("currentUser");
    });

}