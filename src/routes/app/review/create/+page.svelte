<script lang="ts">
    import PageTitle from "$lib/components/ui/controls/PageTitle.svelte";
    import Slider from "$lib/components/ui/controls/Slider.svelte";
    import config from "$lib/config";
    import { searchRestaurants } from "$lib/core/actions/searches/search-restaurant";
    import type { SyncState } from "$lib/core/model/sync-state";
    import { type SearchDropdownItem } from "$lib/core/types/search-dropdown-item";
    import ModalTextfield from "$lib/components/ui/controls/ModalTextfield.svelte";
    import { loadFoods } from "$lib/core/actions/food/load-foods";
    import { fuzzyWordMatch } from "$lib/core/util/matching";
    import TextField from "$lib/components/ui/controls/TextField.svelte";
    import Button from "$lib/components/ui/controls/Button.svelte";
    import { createFoodReview } from "$lib/core/actions/review/create-food-review";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import ErrorSnackbar from "$lib/components/ui/ErrorSnackbar.svelte";
    import type { FoodReview } from "$lib/core/model/food-review";
    import { goto } from "$app/navigation";

    let selectedRestaurant = $state<SearchDropdownItem | null>(null);
    let selectedFood = $state<SearchDropdownItem | null>(null);
    let foodDisabled = $derived(selectedRestaurant === null);
    let ratingDisabled = $derived(selectedFood === null);
    let review = $state("");
    let rating = $state(5);

    $effect(() => {
       if (selectedRestaurant === null) {
        selectedFood = null;
       } 
    });

    const restaurantFetchFunction: (query: string) => Promise<SyncState<SearchDropdownItem[]>> = async (query: string) => {
        const res = await searchRestaurants(query);
        if (res.data !== null) {
            return {
                error: null,
                data: res.data.content.map(item => ({
                    id: item.id,
                    text: item.shortName,
                    subtext: item.name
                } as SearchDropdownItem))
            };
        }
        return res as unknown as SyncState<SearchDropdownItem[]>;
    }

    const foodFetchFunction: (query: string) => Promise<SyncState<SearchDropdownItem[]>> = async (query: string) => {
        if (!selectedRestaurant) return { data: [], error: null };

        const res = await loadFoods(selectedRestaurant.id);

        if (res.data !== null) {
            const normalizedQuery = query.toLowerCase().trim();

            if (!normalizedQuery) {
                return {
                    error: null,
                    data: res.data.map(item => ({
                        id: item.id,
                        text: item.name,
                        subtext: item.description,
                    }))
                };
            }

            const queryWords = normalizedQuery.split(/\s+/);

            const scored = res.data.map(item => {
                const name = item.name.toLowerCase();
                const nameWords = name.split(/\s+/);

                let score = 0;

                for (const qWord of queryWords) {
                    for (const nWord of nameWords) {
                        if (qWord === nWord) score += 30;
                        else if (nWord.startsWith(qWord)) score += 25;
                        else if (nWord.includes(qWord)) score += 20;
                        else if (fuzzyWordMatch(nWord, qWord)) score += 15;
                    }
                }

                return {
                    item: {
                        id: item.id,
                        text: item.name,
                        subtext: item.description,
                    } as SearchDropdownItem,
                    score
                };
            });

            const filtered = scored
                .filter(s => s.score >= 15)
                .sort((a, b) => b.score - a.score)
                .map(s => s.item);

            return {
                error: null,
                data: filtered
            };
        }

        return res as unknown as SyncState<SearchDropdownItem[]>;
    };

    const onCreateReview: (e: Event) => Promise<void> = async (e: Event) => {
        if (!selectedFood) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: "You must select a food to post a review."
                }
            });
            return;
        }

        const res: SyncState<FoodReview> = await createFoodReview(selectedFood?.id, review, rating*2);
        if (res.error != null) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: res.error.message
                }
            });
            return;
        }

        goto(`/app/review/${res.data?.id}`);
    }

</script>
<!--
{#if $currentUserStore.data === null}
    <div class="flex items-center justify-center flex-col">
        <h2 class="text-md">You have to be logged in to create a review.</h2>
        <p><a href="/account/login" class="underline">Login</a> or <a href="/account/register" class="underline">Create an account</a>.</p>
    </div>
{:else}-->
    <PageTitle>Create a review</PageTitle>

    <div class="flex flex-col mt-2 px-6 gap-3 grow">
        <ModalTextfield disabled={false} bind:selected={selectedRestaurant} fetchFunction={restaurantFetchFunction} imageUrlFunction={config.apiPaths.restaurantImage} placeholder="Restaurant" className=""></ModalTextfield>
        <ModalTextfield bind:disabled={foodDisabled} bind:selected={selectedFood} fetchFunction={foodFetchFunction} imageUrlFunction={config.apiPaths.foodImage} placeholder="Food" className=""></ModalTextfield>

        <Slider bind:disabled={ratingDisabled} bind:value={rating} name="Rating" className="mt-4" />
        <TextField maxLength={256} bind:disabled={ratingDisabled} bind:value={review} textarea={true} noDecoration={true} placeholder="Review (optional)" className="grow"></TextField>
        <div class="flex justify-end">
            <Button bind:disabled={ratingDisabled} onclick={onCreateReview} className="py-1 px-4 mb-4">Create Review</Button>
        </div>
    </div>
<!--
{/if}-->