import { LoginAsker, modalStore } from "$lib";
import { loadFood } from "$lib/core/actions/food/load-food";
import { loadRestaurant } from "$lib/core/actions/restaurant/load-restaurant";
import type { Food } from "$lib/core/model/food";
import type { Restaurant } from "$lib/core/model/restaurant";
import type { SyncState } from "$lib/core/model/sync-state";
import type { PageLoad, PageLoadEvent } from "../../restaurant/$types";

export const load: PageLoad = async (event: PageLoadEvent) => {
    const { user } = await event.parent(); // to make sure we are logged in/have the current user
    
    if (user === null) {
        modalStore.set({
            component: LoginAsker,
            props: {
                actionName: "create a review"
            }
        });
        return;
    }

    const restaurantId: number = parseInt(event.url.searchParams.get('restaurantId') ?? '-1');
    const foodId: number = parseInt(event.url.searchParams.get('foodId') ?? '-1');


    if (foodId != -1) {
        const food: SyncState<Food> = await loadFood(foodId);
        if (food.error != null) {
            return { user, warning: "Error loading the food, continuing with no food"};
            console.error(food.error);
        }

        return {
            user, food: food.data, restaurant: {
                id: food.data?.restaurantId,
                name: food.data?.restaurantName,
                shortName: food.data?.restaurantShortName
            }
        };
    } else if (restaurantId != -1) {
        const restaurant: SyncState<Restaurant> = await loadRestaurant(restaurantId);
         if (restaurant.error != null) {
            console.error(restaurant.error);
            return { user, warning: "Error loading the food, continuing with no food"};
        }

        return {
            user, restaurant: {
                id: restaurant.data?.id,
                name: restaurant.data?.name,
                shortName: restaurant.data?.shortName
            }
        };
    }
}