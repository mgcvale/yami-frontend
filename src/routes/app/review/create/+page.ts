import { LoginAsker, modalStore } from "$lib";
import type { PageLoad, PageLoadEvent } from "../../restaurant/$types";

export const load: PageLoad = async (event: PageLoadEvent) => {
    const { user } = await event.parent(); // to make sure we are logged in/have the current user
    
    if (user === null) {

        modalStore.set({
            component: LoginAsker,
            props: {
                actionName: "create a review"
            }
        });
}

}