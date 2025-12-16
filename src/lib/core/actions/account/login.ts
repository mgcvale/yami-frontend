import { goto, invalidate, replaceState } from "$app/navigation";
import config from "$lib/config";
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import { writable, type Writable } from "svelte/store";
import Cookies from 'js-cookie';
import type { AsyncState } from "$lib/core/model/async-state";
import type { CurrentUser } from "$lib/core/model/current-user";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError, syncSuccess } from "../util";
import { isLoginUserDTO } from "$lib/core/model/dto/login-user-dto";
import type { SyncState } from "$lib/core/model/sync-state";
import { handleAllGeneric, handleNetwork, handleUnknownException } from "../generic-error-handler";
import { logout } from "./logout";

export const loginResponse: Writable<AsyncState<null>> = writable({
    data: null,
    loading: true,
    error: null
});

export function validateInputs(
    usernameOrEmail: string,
    password: string
): [string, string, boolean] {

    if (usernameOrEmail.length === 0) {
        return ["O nome de usuário ou e-mail não pode estar vazio", "", false];
    }

    if (password.length === 0) {
        return ["", "A senha não pode estar vazia", false];
    }

    return ["", "", true];
}

export async function login(
    usernameOrEmail: string,
    password: string
): Promise<SyncState<null>> {

    const jsonData = JSON.stringify({
        [usernameOrEmail.match(config.emailRegex) ? 'email' : 'username']: usernameOrEmail,
        password,
    });

    try {
        logout(() => {});

        const data = await extractJsonOrThrow(
            await fetchWithTimeout(
                config.apiPaths.login(),
                { method: "POST", body: jsonData },
                config.fetchTimeout
            )
        );

        console.log(data);

        if (!isLoginUserDTO(data)) {
            handleAllGeneric(DEFAULT_ERRORS.BAD_RESPONSE);
            return syncError(DEFAULT_ERRORS.BAD_RESPONSE);
        }

        Cookies.set('accessToken', data.accessToken, { expires: 180 });

        const user: CurrentUser = {
            id: data.id,
            username: data.username,
            email: data.email,
            accessToken: data.accessToken,
            bio: data.bio,
            location: data.location,
            followerCount: data.followerCount,
            followingCount: data.followingCount,
            reviewCount: data.reviewCount,
            following: false,
        };

        currentUserStore.set({
            data: user,
            loading: false,
            error: null
        });

        localStorage.setItem("currentUser", JSON.stringify(user));

        goto('/app', { replaceState: true, invalidateAll: true });
        return syncSuccess(null);

    } catch (e) {
        if (isAppError(e)) {
            if ([401, 409].includes(e.status)) {
                return syncError(e);
            }

            handleAllGeneric(e);
            return syncError(e);

        } else if (e instanceof TypeError) {
            handleNetwork(e);
            return syncError(DEFAULT_ERRORS.NETWORK_ERROR);
        }

        handleUnknownException(e);
        return syncError(DEFAULT_ERRORS.NETWORK_ERROR);
    }
}
