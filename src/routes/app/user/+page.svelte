<script lang="ts">
    import Divisor from "$lib/components/ui/Divisor.svelte";
    import FoodReviewList from "$lib/components/ui/FoodReviewList.svelte";
    import RatingStats from "$lib/components/ui/RatingStats.svelte";
    import UserHeader from "$lib/components/ui/UserHeader.svelte";
    import type { PublicUser } from "$lib/core/model/public-user";
    import type { ReviewStats } from "$lib/core/model/review-stats";
    import { modalStore, LoginAsker } from "$lib";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import EditProfileModal from "$lib/components/ui/modals/EditProfileModal.svelte";

    let { data }: { data: { user: PublicUser; stats: ReviewStats; userId: number; viewingSelf: boolean } } = $props();

    onMount(() => {
        console.log("LOADED MAIN PAGE");
    })

    $effect(() => {
        if (!data.user && data.viewingSelf) {
            modalStore.set({
                component: LoginAsker,
                props: {
                    actionName: "ver seu perfil"
                }
            });
        }
    });

    function onFollowerClick() {
        goto(`/app/user/followers?id=${data.userId}`);
    }

    function onFollowingClick() {
        goto(`/app/user/following?id=${data.userId}`);
    }

    function onEditClick() {
        modalStore.set({
            component: EditProfileModal,
            props: {user: data.user}
        });
    }
</script>

<div class="flex flex-col py-4 pt-6 px-2 gap-3 text-center">
    {#if data.user}
        <UserHeader {onEditClick} {onFollowerClick} {onFollowingClick} bind:user={data.user} viewingSelf={data.viewingSelf} />
        <RatingStats className="p-2" name={data.user.username} stats={data.stats} />
        <Divisor lineClassName="bg-light-card-2 dark:bg-dark-card-2" containerClassName="px-4" />
        <h1 class="font-alegreya text-2xl text-left px-3 pt-1">Avaliações de {data.user.username}</h1>
        <FoodReviewList userReviews={true} viewingSelf={data.viewingSelf} id={data.userId} className="p-2 pt-0" />
    {:else}
        <p>Você deve estar logado para ver seu perfil.</p>
    {/if}
</div>