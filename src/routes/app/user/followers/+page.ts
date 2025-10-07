import { loadFollowers } from "$lib/core/actions/account/follow-loader";
import type { PageLoad, PageLoadEvent } from "./$types";

export const load: PageLoad = async (e: PageLoadEvent) => {
    const { parent, depends } = e;
    const { user, userId, viewingSelf } = await parent();

    const followers = await loadFollowers(userId);

    return { user, userId, followers: followers.data, viewingSelf}
}