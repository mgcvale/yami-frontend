<script lang="ts">
    import { onNavigate } from "$app/navigation";
    import { page } from "$app/state";   
    import { currentUserStore, LoginAsker, modalStore, type CurrentUser, type PublicUser } from "$lib";
    import Divisor from "$lib/components/ui/Divisor.svelte";
    import FoodReviewList from "$lib/components/ui/FoodReviewList.svelte";
    import RatingStats from "$lib/components/ui/RatingStats.svelte";
    import UserHeader from "$lib/components/ui/UserHeader.svelte";
    import { loadPublicAccountStore, loadPublicUser } from "$lib/core/actions/account/loadPublicAccount";
    import { loadUserStats, loadUserStatsStore } from "$lib/core/actions/account/loadUserStats";
    import type ReviewStats from "$lib/core/model/reviewStats";
    import type { AsyncState } from "$lib/core/types/asyncState";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let isPageViewable: boolean = $state(true);
    let viewingSelf: boolean = $state(false);
    let thisUser: AsyncState<PublicUser> = $state({
        data: null,
        loading: true,
        error: null,
    });
    let thisUserStats: AsyncState<ReviewStats> = $state({
        data: null,
        loading: true,
        error: null,
    });
    let user: PublicUser | null = $state(null);
    let hasAttemptedLoad: boolean = $state(false); // track load attempts

    // Track the current user ID to prevent redundant loads
    let currentViewedUserId: string | null = $state(null);

    function load(currentUser: AsyncState<CurrentUser>, userid: string | null) {
        
        // Update the tracked user ID
        currentViewedUserId = userid;

        if (currentUser.loading) {
            console.log("REFUSED TO LOAD: current user wasn't yet loaded");
            return;
        }

        if (currentUser.data !== null) {
            if (userid === null || userid === currentUser.data.id.toString()) {
                // Viewing own profile
                if (!viewingSelf || thisUser.data?.id !== currentUser.data.id) {
                    thisUser = currentUser;
                    user = currentUser.data;
                    loadUserStats(currentUser.data.id);
                    viewingSelf = true;
                }
                return;
            }
            
            // Viewing someone else's profile
            viewingSelf = false;
            console.log("Loading public user data for ID:", userid);
            loadPublicUser(parseInt(userid));
            loadUserStats(parseInt(userid));
            return;
        }

        if (userid !== null) {
            // Not logged in but viewing a specific user
            viewingSelf = false;
            console.log("Loading public user data for ID:", userid);
            loadPublicUser(parseInt(userid));
            loadUserStats(parseInt(userid));
        } else {
            // Not logged in and no specific user to view
            thisUser = {
                loading: false,
                data: null,
                error: null
            };
            thisUserStats = {
                loading: false,
                data: null,
                error: {
                    status: 401,
                    json: {}
                }
            };
            modalStore.set({
                component: LoginAsker,
                props: {
                    actionName: "view your profile"
                }
            });                
            isPageViewable = false;
        }
    }

    // Handle URL parameter changes
    $effect(() => {
        const id = page.url.searchParams.get('id');
        // Only load if the ID actually changed
        if (id !== currentViewedUserId) {
            hasAttemptedLoad = false; // Reset attempt flag for new ID
            load(get(currentUserStore), id);
        }
        if (id == null) {
            load(get(currentUserStore), id);
        }
    });

    onMount(() => {

        // Subscribe to public account store changes
        loadPublicAccountStore.subscribe(newPublicAccount => {
            // Only update if this is for our current viewed user
            const id = page.url.searchParams.get('id');
            if (id === currentViewedUserId && !viewingSelf) {
                thisUser = newPublicAccount;
                user = newPublicAccount.data;
            }
        });

        // Subscribe to current user store changes
        currentUserStore.subscribe(newStore => {
            if (!newStore.loading) {
                const id = page.url.searchParams.get('id');
                // Only reload if necessary
                if ((id === null && newStore.data !== null) || 
                    (id === newStore.data?.id.toString() && !viewingSelf)) {
                    console.log("Reloading due to logged in user change");
                    load(newStore, id);
                }
            }
        });

        // Subscribe to user stats store changes
        loadUserStatsStore.subscribe(newStore => {
            thisUserStats = newStore;
        });
    });
</script>

<div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
    {#if thisUser.loading}
        <h2 class="w-full text-center text-xl">Loading...</h2>
    {:else}
        {#if !isPageViewable}
            <p>You must be logged in to view this page.</p>
        {:else if thisUser.data === null}
            {#if thisUser.error !== null}
                <h2 class="text-xl text-light-error dark:text-dark-error w-full text-center">An error occurred!</h2>
                {#if thisUser.error.status === 404}
                    <p>The user you requested wasn't found.</p>
                    <a class="underline" href="/app">Go to home</a>
                {:else if thisUser.error.status === 500}
                    <p>An error occurred on our end. You can try again later.</p>
                    <a class="underline" href="/app">Go to home</a>
                {:else if thisUser.error instanceof TypeError}
                    <p>A network error occurred. Check if you're connected to the internet</p>
                {:else}
                    <p>An unknown error occurred.</p>
                    <p>Error status: {thisUser.error.status}</p>
                {/if}
            {:else}
                <h2 class="text-xl font-alegreya">An unknown error occurred!</h2>
            {/if}
        {:else if user !== null}
            <UserHeader bind:user={user} viewingSelf={viewingSelf} />
            <RatingStats className={"p-2"} name={user?.username ?? ''} bind:stats={thisUserStats} />
            <Divisor lineClassName={"bg-light-card-2 dark:bg-dark-card-2"} containerClassName={"px-4"} />
            <h1 class="font-alegreya text-2xl text-left px-3 pt-1"> {user.username}'s reviews</h1>
            <FoodReviewList userId={user?.id} className={"p-2 pt-0"} />
        {:else}
            <h2 class="text-xl font-alegreya">An unknown error occurred - user is null</h2>
        {/if}
    {/if}
</div>