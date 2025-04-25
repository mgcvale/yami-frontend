<script lang="ts">
    import { page } from "$app/state";   
    import { currentUserStore, LoginAsker, modalStore, type PublicUser } from "$lib";
    import RatingStats from "$lib/components/ui/RatingStats.svelte";
    import UserHeader from "$lib/components/ui/UserHeader.svelte";
    import { loadPublicUser } from "$lib/core/actions/account/loadPublicAccount";
    import type { ErrorResponse } from "$lib/core/types/errorResponse";
    import { onMount } from "svelte";

    let thisUser: PublicUser | ErrorResponse | null = $state(null);
    let viewingSelf: boolean = $state(false);
        
    onMount(() => {
        const searchParamsUserId = page.url.searchParams.get("id");
        const loggedUserId = $currentUserStore?.id;

        if (searchParamsUserId !== null) {
            // case 1: ID is present in URL -> Load user by that ID (regardless of login status)
            const userId = parseInt(searchParamsUserId);
            thisUser = loadPublicUser(userId);
            // in any way, if the user is logged in, we can check if it is their own page
            if (loggedUserId !== undefined) {
                if ((thisUser as PublicUser).id === loggedUserId) {
                    viewingSelf = true;
                }
            }
        } else if (loggedUserId !== undefined) {
            // case 2: No ID in URL but user is logged in -> Show their own profile
            thisUser = $currentUserStore;
            viewingSelf = true;
        } else {
            // case 3: No ID and no user logged in -> Ask to log in
            modalStore.set({
                component: LoginAsker,
                props: {
                    actionName: "view your profile"
                }
            });
        }
    });

</script>

{#if thisUser === null} 
    <p>To view this page, you must be logged in.</p>
{:else if 'status' in thisUser}
    <h2 class="text-xl font-alegreya">An error occoured!</h2>
    <p>Error status: {(thisUser as ErrorResponse).status}</p>
    <p>Error json: {(thisUser as ErrorResponse).json}</p>
{:else}
    <div class="flex flex-col py-4 pt-6 px-2 gap-3">
        <UserHeader user={(thisUser as PublicUser)} viewingSelf={viewingSelf} />
        <RatingStats className={"p-2"} name={(thisUser as PublicUser).username} stats={{averageRating: 5.6, ratingDistribution: {
            0: 2,
            1: 2,
            2: 1,
            3: 1,
            4: 3,
            5: 2,
            6: 3,
            7: 5,
            8: 4,
            9: 7,
            10: 9,
            11: 9,
            12: 10,
            13: 12,
            14: 8,
            15: 7,
            16: 4,
            17: 5,
            18: 3,
            19: 3,
            20: 1
        }}}></RatingStats>
    </div>
{/if}