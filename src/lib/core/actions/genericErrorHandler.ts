import ValidationErrorModal from "$lib/components/ui/ValidationErrorModal.svelte";
import { modalStore } from "../store/modalStore";
import type { ErrorResponse } from "../types/errorResponse";

export function handle500(error: ErrorResponse) {
    modalStore.set({
        component: ValidationErrorModal,
        props: {
            title: "Internal Error",
            message: "There was an error on our end. You can try again later, or notify us at <a href='https://github.com/mgcvale/yami' class='underline'>Github</a>"
        }
    });
}

export function handle502(error: ErrorResponse) {
    modalStore.set({
        component: ValidationErrorModal,
        props: {
            title: "Upstream error",
            message: "There was an error with one of our service providers. You can try again later, or notify us at <a href='https://github.com/mgcvale/yami' class='underline'>Github</a>"
        }
    })
}

export function handleUnknown(error: ErrorResponse) {
    modalStore.set({
        component: ValidationErrorModal,
        props: {
            title: "Unknown error",
            message: `There was an unknown error on our end. Error code: ${error.status}, error message: ${error.status}`,
        }
    });
}

export function HandleAllGeneric(error: ErrorResponse) {
    switch(error.status) {
        case 500:
            return handle500(error);
        case 502:
            return handle502(error);
        default:
            return handleUnknown(error);
    }
}