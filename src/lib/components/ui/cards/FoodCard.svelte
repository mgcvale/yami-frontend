<script lang="ts">
    import { goto } from "$app/navigation";
    import config from "$lib/config";
    import { type Food } from "$lib/core/model/food";
    import RatingPill from "../controls/RatingPill.svelte";

    let { 
        food,
    }: {
        food: Food,
    } = $props();

    let imageVisible = $state(true);

</script>

<button onclick={() => {
        goto(`/app/food?id=${food.id}`);
    }}
    class="w-full h-fit bg-light-card-2 hover:bg-light-card-3 dark:hover:bg-dark-card-2 active:bg-light-card-3 dark:active:bg-dark-card-2 dark:bg-dark-card-1 p-3 items-start flex flex-col gap-2 jutsify-start rounded-2xl cursor-pointer"
>
    <div class="flex justify-between items-start w-full gap-2 h-fit">
        <h3 class="text-lg text-ms text-left line-clamp-2 break-words">{food.name}</h3>

        {#if food.avgRating === 0}
            <span class="font-medium text-md">Sem avaliações</span>
        {:else}
            <RatingPill rating={food.avgRating} />
        {/if}
    </div>
    <div class="flex gap-2">

        {#if imageVisible}
            <img
                src={config.apiPaths.foodImage(food.id)} 
                class="max-w-16 rounded-lg"
                onerror={() => imageVisible = false}
                alt={food.description}
            >
        {/if}
        <p class="text-start text-sm text-light-fg-700 dark:text-dark-fg-700">
            {food.description}
        </p>
    </div>
</button>