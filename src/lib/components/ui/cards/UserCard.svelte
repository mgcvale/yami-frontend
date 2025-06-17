<script lang="ts">
    import { goto } from "$app/navigation";
    import { searchUserStore } from "$lib/core/actions/searches/searchUser";
    import type PublicUser from "$lib/core/model/publicUser";

    let { 
        user,
    }: {
        user: PublicUser,
    } = $props();

</script>


<button onclick={() => {
        goto(`/app/user?id=${user.id}`);
        searchUserStore.set({
            loading: false,
            data: null,
            error: null,
        });
    }
} class="w-full h-fit bg-light-card-2 hover:bg-light-card-3 dark:hover:bg-dark-card-2 active:bg-light-card-3 dark:active:bg-dark-card-2 dark:bg-dark-card-1 p-2 px-4 items-start flex flex-col gap-2 jutsify-start rounded-2xl cursor-pointer"
>
    <div class="flex justify-start items-center gap-2 h-10 pt-1">
        <img class="h-full w-auto block rounded-full" src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="user">
        <h3 class="text-lg">{user.username}</h3>
        <span class="text-sm text-light-fg-700 dark:text-dark-fg-700">• From <span>{user.location}</span></span>
    </div>
    <p class="text-start text-sm text-light-fg-700 dark:text-dark-fg-700">
        {user.bio}
    </p>
</button>