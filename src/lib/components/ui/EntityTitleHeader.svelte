<script lang="ts">
    import Button from "./Button.svelte";

    let { 
        className="", 
        name="", 
        nameClassName="", 
        bio="", 
        bioClassName="", 
        location="", 
        locationClassName="", 
        editable=false, 
        onEditClick = () => {}, 
        onFollowClick = () => {}, 
        following = $bindable(false), // following may change upon follow/unfollow
    }: {
        className: string,
        name: string,
        nameClassName?: string,
        bio: string,
        bioClassName?: string,
        location: string,
        locationClassName?: string,
        editable: boolean,
        onEditClick: () => void,
        onFollowClick: () => void,
        following: boolean
    } = $props();

</script>

<div class="flex flex-col justify-start items-start text-start {className}">
    <h2 class="text-light-fg-50 dark:text-dark-fg-50 text-xl font-bold font-alegreya mx-1 {nameClassName}">
        @{name}
    </h2>
    <h4 class="text-md font-dm-sans text-light-fg-500 dark:text-dark-fg-500 text-ms mx-1 {bioClassName}">
        {bio}
        {#if location !== null && location.trim() !== ""}
            <span class="text-sm text-light-fg-700 dark:text-dark-fg-700">• From <span class="{locationClassName}">{location}</span></span>
        {/if}
    </h4>
    {#if editable}
        <Button onclick={onEditClick} accent={false} outline={false} className="w-full rounded-ml py-0.5 mt-2">
            Edit profile
        </Button>
    {:else}
        <Button onclick={onFollowClick} accent={following} outline={following} className="w-full rounded-ml py-0.5 mt-2">
            {following ? "Unfollow" : "Follow"}
        </Button>
    {/if}
    

</div>