<script lang="ts">
    import { goto } from "$app/navigation";
    import Card1 from "$lib/components/ui/cards/Card1.svelte";
    import Card2 from "$lib/components/ui/cards/Card2.svelte";
    import UserCard from "$lib/components/ui/cards/UserCard.svelte";
    import TextField from "$lib/components/ui/controls/TextField.svelte";
    import HeaderWithBackButton from "$lib/components/ui/HeaderWithBackButton.svelte";
    import type { PublicUser, PublicUserWithoutCounts } from "$lib/core/model/public-user";
    import type { ReviewStats } from "$lib/core/model/review-stats";

    let { data }: { data: { user: PublicUser; stats: ReviewStats; userId: number; viewingSelf: boolean, following: PublicUserWithoutCounts[] } } = $props();

    let searchQuery = $state("");
    let actualFollowing = $state(data.following);

    function onUserClick(id: number) {
        goto(`/app/user?id=${id}`);
    }

    function onUserEnter(e: KeyboardEvent, id: number) {
        if (e.key === 'enter') onUserClick(id);
    }

    $effect(() => {
        actualFollowing = data.following.filter(datapoint => {
            return datapoint.username.includes(searchQuery);
        });
    })

</script>

<HeaderWithBackButton title="Usuários que {data.viewingSelf ? 'você segue' : data.user.username.concat(' segue')}"></HeaderWithBackButton>

<div class="w-full grow flex flex-col p-4">
    <Card1 className="w-full h-full grow p-3! gap-2! flex flex-col justify-start items-center overflow-scroll">

        <TextField bind:value={searchQuery} noDecoration={true} placeholder="Pesquisar seguidores" className="w-full rounded-xl! h-12 bg-light-card-2! dark:bg-dark-card-2! px-2" inputClassName="bg-light-card-2 dark:bg-dark-card-2" />

        {#if actualFollowing.length === 0}
            <Card2 className="w-full flex"><span class="m-auto">Nenhum usuário encontrado!</span></Card2>
        {:else}
            {#each actualFollowing as follower: isPublicUserWithoutCounts, i}
                <div
                    onclick={() => onUserClick(follower.id)} 
                    role="button" tabindex={i} 
                    onkeypress={(e) => onUserEnter(e, follower.id)} 
                    class="w-full"
                >
                    <UserCard user={follower as PublicUser} />
                </div>
            {/each}
        {/if}

    </Card1>
</div>