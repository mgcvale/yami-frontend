<script lang="ts">
    import PageTitle from "$lib/components/ui/controls/PageTitle.svelte";
    import Slider from "$lib/components/ui/controls/Slider.svelte";
    import config from "$lib/config";
    import { searchRestaurants } from "$lib/core/actions/searches/search-restaurant";
    import type { SyncState } from "$lib/core/model/sync-state";
    import { type SearchDropdownItem } from "$lib/core/types/search-dropdown-item";
    import ModalTextfield from "$lib/components/ui/controls/ModalTextfield.svelte";
    import { loadFoods } from "$lib/core/actions/food/load-foods";
    import TextField from "$lib/components/ui/controls/TextField.svelte";
    import Button from "$lib/components/ui/controls/Button.svelte";
    import { createFoodReview } from "$lib/core/actions/review/create-food-review";
    import { snackbarStore } from "$lib/core/store/snackbarStore";
    import ErrorSnackbar from "$lib/components/ui/ErrorSnackbar.svelte";
    import type { FoodReview } from "$lib/core/model/food-review";
    import { goto } from "$app/navigation";
    import { syncSuccess } from "$lib/core/actions/util";
    import type { CurrentUser } from "$lib/core/model/current-user";
    import type { Food } from "$lib/core/model/food";
    import { onMount } from "svelte";

    let selectedRestaurant = $state<SearchDropdownItem | null>(null);
    let selectedFood = $state<SearchDropdownItem | null>(null);
    let foodDisabled = $derived(selectedRestaurant === null);
    let ratingDisabled = $derived(selectedFood === null);
    let review = $state("");
    let rating = $state(5);

    $effect(() => {
       if (selectedRestaurant === null) {
        selectedFood = null;
       }  else {
        fetchRestaurantFoods();
       }
    });
    
    let {
        data
    }: {
        data: {
            user: CurrentUser,    
            restaurant?: {
                id: number,
                name: string,
                shortName: string
            },
            food?: Food,
            warning?: string
        }
    } = $props();

    let loadedRestaurantFoods: SyncState<SearchDropdownItem[]> = $state({data: [], error: null});
    let restaurantFoodsLoading = $state(false);
    let forceFoodListUpdate = $state(false);

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

    async function fetchRestaurantFoods() {

        restaurantFoodsLoading = true;
        if (!selectedRestaurant) {
            loadedRestaurantFoods = syncSuccess([]);
            return;
        }

        const res = await loadFoods(selectedRestaurant.id);
        if (res.data === null) {
            loadedRestaurantFoods = (res as unknown as SyncState<SearchDropdownItem[]>);
            return;
        }

        loadedRestaurantFoods = syncSuccess(res.data.map(item => ({
            id: item.id,
            text: item.name,
            subtext: item.description
        } as SearchDropdownItem)));
        restaurantFoodsLoading = false;

        forceFoodListUpdate = true;
        setTimeout(() => forceFoodListUpdate = false);
    }

    const foodFetchFunction: (query: string) => Promise<SyncState<SearchDropdownItem[]>> = async (query: string) => {
        if (!selectedRestaurant) return { data: [], error: null };
        if (loadedRestaurantFoods.error !== null || loadedRestaurantFoods.data === null) return loadedRestaurantFoods;

        const normalizedQuery = query.toLowerCase().trim();

        if (!normalizedQuery) return { error: null, data: loadedRestaurantFoods.data };

        const rankItem = (text: string) => {
            text = text.toLowerCase();
            let score = 0;
            let qi = 0; // query index
            for (let i = 0; i < text.length && qi < normalizedQuery.length; i++) {
                if (text[i] === normalizedQuery[qi]) {
                    // match found, more weight if earlier in text
                    score += 10 - i * 0.1;
                    qi++;
                }
            }
            // small bonus for longer matches
            score += qi * 5;
            return score;
        };

        const ranked = loadedRestaurantFoods.data
            .map(item => {
                const text = item.text + " " + (item.subtext ?? "");
                return { item, score: rankItem(text) };
            })
            .sort((a, b) => b.score - a.score)
            .map(r => r.item);

        return { error: null, data: ranked };
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

        goto(`/app/food?id=${selectedFood?.id}`);
    }

    let rangeValue = $state();

    onMount(() => {
        if (data.restaurant) {
            selectedRestaurant = {
                id: data.restaurant.id,
                text: data.restaurant.shortName,
                subtext: data.restaurant.name
            };
        }
        if (data.food) {
            selectedFood = {
                id: data.food.id,
                text: data.food.name,
                subtext: data.food.description
            };
        }
        if (data.warning) {
            snackbarStore.set({
                component: ErrorSnackbar,
                props: {
                    warningMessage: data.warning
                }
            });
        }
    })
    let reviewFieldRef = $state<HTMLTextAreaElement | null>(null);

    function handleReviewFocus() {
        console.log("ONFOCUSSS");
        console.log(reviewFieldRef);
        if (reviewFieldRef) {
            setTimeout(() => {
                reviewFieldRef!.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });
            }, 100); 
        }
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
        <ModalTextfield forceListUpdate={false} searchOnKeydown={false} disabled={false} bind:selected={selectedRestaurant} fetchFunction={restaurantFetchFunction} imageUrlFunction={config.apiPaths.restaurantImage} placeholder="Restaurant" className=""></ModalTextfield>
        <ModalTextfield loadingMessage="Loading foods for {selectedRestaurant?.text}..." bind:loading={restaurantFoodsLoading} forceListUpdate={forceFoodListUpdate} searchOnKeydown={true} bind:disabled={foodDisabled} bind:selected={selectedFood} fetchFunction={foodFetchFunction} imageUrlFunction={config.apiPaths.foodImage} placeholder="Food" className=""></ModalTextfield>

        <Slider bind:disabled={ratingDisabled} bind:value={rating} name="Rating" className="mt-4" />
        <TextField maxLength={256} bind:disabled={ratingDisabled} bind:value={review} textarea={true} noDecoration={true} placeholder="Review (optional)" className="grow" bind:input={reviewFieldRef} onfocus={handleReviewFocus}></TextField>
        <div class="flex justify-end">
            <Button bind:disabled={ratingDisabled} onclick={onCreateReview} className="py-1 px-4 mb-4">Create Review</Button>
        </div>
    </div>
<!--
{/if}-->