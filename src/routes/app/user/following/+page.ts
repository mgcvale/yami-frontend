import { loadFollowers, loadFollowing } from "$lib/core/actions/account/follow-loader";
import type { PageLoad, PageLoadEvent } from "./$types";

export const load: PageLoad = async (e: PageLoadEvent) => {
    const { parent, depends } = e;
    const { user, userId, viewingSelf } = await parent();

    const following = await loadFollowing(userId);

    return { user, userId, following: following.data, viewingSelf}
}