<script lang="ts">
    import type PublicUser from "$lib/core/model/publicUser";
    import EntityStatsHeader from "./EntityStatsHeader.svelte";
    import EntityTitleHeader from "./EntityTitleHeader.svelte";

    let { user, viewingSelf = false }: {
        user: PublicUser,
        viewingSelf: boolean,

    } = $props();
</script>


<EntityStatsHeader 
className='h-24' 
name={user.username} 
headers={[
    {
        name: "Reviews",
        nameClassName: "text-ml",
        count: user.reviewCount,
        countClassName: "text-lg text-light-fg-hc dark:text-dark-fg-hc",
    },
    {
        name: "Followers",
        nameClassName: "text-opacity-80 text-sm",
        count: user.followerCount,
        countClassName: "text-opacity-80 text-md",
    },
    {
        name: "Following",
        nameClassName: "text-opacity-80 text-sm",
        count: user.followingCount,
        countClassName: "text-opacity-80 text-md"
    },
]}
pictureUrl={"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
/>
<EntityTitleHeader name={user.username} bio={user.bio} location={user.location} className="mx-2" editable={viewingSelf} />
