import { goto } from "$app/navigation";
import config from "$lib/config";
import { DEFAULT_ERRORS } from "$lib/core/types/error-codes";
import Cookies from 'js-cookie';
import { currentUserStore } from "$lib/core/store/currentUserStore";
import { handleAllGeneric, handleNetwork, handleUnknownException } from "../generic-error-handler";
import { extractJsonOrThrow, fetchWithTimeout, isAppError, syncError } from "../util";
import { isCreateUserDTO } from "$lib/core/model/dto/create-user-dto";


export function validateInputs(username: string, email: string, password: string): [string, string, string, boolean] {
    if (username.length === 0) {
        return ["You must provide a username", "", "", false];
    }

    if (username.length < 3) {
        return ["The username must be at least 3 characters long", "", "", false];
    }
    
    if (username.length > 31) {
        return ["The username must be at most 32 characters long", "", "", false];
    }
    
    if (email.length === 0) {
        return ["", "You must provide an email", "", false]
    }
    
    if (!email.match(config.emailRegex)) {
        return ["", "You must provide a valid email", "", false]
    }
    
    if (password.length === 0) {
        return ["", "", "You must provide a password", false];
    }

    if (password.length < 8) {
        return ["", "", "Your password must have at least 8 characters", false];
    }

    return ["", "" , "", true];
}

export async function createAccount(username: string, email: string, password: string): Promise<[string, string, string]> {
    let retval: [string, string, string] = ["", "", ""];

    try {
        const res = await extractJsonOrThrow(await fetchWithTimeout(config.apiPaths.user(), {
            method: 'POST',
            body: JSON.stringify({ username, password, email: email.toLowerCase() })
        }, config.fetchTimeout));

        console.log("Create account response: ", res);
        
        if (!isCreateUserDTO(res)) {
            handleAllGeneric(DEFAULT_ERRORS.BAD_RESPONSE);
            return retval;
        }
        
        Cookies.set('accessToken', res.accessToken, { expires: 180 });
        currentUserStore.set({
            loading: false,
            data: {
                id: res.id,
                username: res.username,
                accessToken: res.accessToken,
                email: res.email,
                bio: "",
                location: "",
                followerCount: res.followerCount,
                followingCount: res.followingCount,
                reviewCount: res.reviewCount,
                following: false,
            },
            error: null
        });
        goto("/account/details");

    } catch (e) {
        if (isAppError(e)) {
            if (e.status === 409) {
                console.log("status was 409")
                return ["This username is already in use", "", ""];
            }
            handleAllGeneric(e);
        } else if (e instanceof TypeError) {
            handleNetwork(e);
        } else {
            handleUnknownException(e);
        }
    }

    return retval;
}