import ValidationErrorModal from "$lib/components/ui/ValidationErrorModal.svelte";
import type { SyncState } from "../model/sync-state";
import { modalStore } from "../store/modalStore";
import { DEFAULT_ERRORS } from "../types/error-codes";
import { isAppError, syncError } from "./util";

export function handle500(error: App.Error) {
    modalStore.set({
        component: ValidationErrorModal,
        props: {
            title: "Internal Error",
            message: "There was an error on our end. You can try again later, or notify us at <a href='https://github.com/mgcvale/yami' class='underline'>Github</a>"
        }
    });
}

export function handle502(error: App.Error) {
    modalStore.set({
        component: ValidationErrorModal,
        props: {
            title: "Upstream error",
            message: "There was an error with one of our service providers. You can try again later, or notify us at <a href='https://github.com/mgcvale/yami' class='underline'>Github</a>"
        }
    })
}

export function handleUnknown(error: App.Error) {
    modalStore.set({
        component: ValidationErrorModal,
        props: {
            title: "Unknown error",
            message: `There was an unknown error on our end. Error code: ${error.status}, error message: ${error.message}`,
        }
    });
}

export function handleNetwork(e: TypeError) {
    modalStore.set({
        component: ValidationErrorModal,
        props: {
            title: "Network error",
            message: "A network error ocurred. Verify your internet connection and try again"
        }
    });
}

export function handleUnknownException(e: unknown) {
    console.log("Setting unknown exception modal");
    modalStore.set({
        component: ValidationErrorModal,
        props: {
            title: "Unknown error",
            message: `There was an unknown error on our end. Error: ${e}`,
        }
    });
}

export function handleAllGeneric(error: App.Error) {
    switch(error.status) {
        case 500:
            return handle500(error);
        case 502:
            return handle502(error);
        default:
            return handleUnknown(error);
    }
}

export function handleAsSyncError<T>(e: unknown): SyncState<T> {
    if (isAppError(e)) {
        return syncError(e);
    } if (e instanceof TypeError) {
        return syncError(DEFAULT_ERRORS.NETWORK_ERROR);
    } else {
        return syncError(DEFAULT_ERRORS.UNKNOWN(e));
    }
}