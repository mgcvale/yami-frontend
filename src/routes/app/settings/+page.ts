import type { PageLoad } from "./$types";
import type { PageParentData } from "../$types";

export const load: PageLoad = async ({parent, url, params}) => {
    const { user }: PageParentData = await parent();

    return { user };
}