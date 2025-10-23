export interface Food {
    id: number;
    restaurantId: number;
    restaurantName: string;
    restaurantShortName: string;
    name: string;
    description: string; 
    avgRating: number;
    review: {
        review: string,
        rating: number,
        id: number
    } | undefined;
};

export function isFood(food: any): food is Food {
    const initialMatch = (
        food !== null &&
        typeof food === 'object' &&
        typeof food.id === 'number' &&
        typeof food.restaurantId === 'number' &&
        typeof food.restaurantName === 'string' &&
        typeof food.restaurantShortName === 'string' &&
        typeof food.name === 'string' &&
        typeof food.description === 'string' &&
        typeof food.avgRating === 'number'
    );

    if (!initialMatch) {
        console.error("food validation failed; debug info:");
        console.error({
            foodType: typeof food,
            isObject: typeof food === 'object',
            isNull: food === null,
            id: { value: food?.id, type: typeof food?.id, ok: typeof food?.id === 'number' },
            restaurantId: { value: food?.restaurantId, type: typeof food?.restaurantId, ok: typeof food?.restaurantId === 'number' },
            restaurantName: { value: food?.restaurantName, type: typeof food?.restaurantName, ok: typeof food?.restaurantName === 'string' },
            restaurantShortName: { value: food?.restaurantShortName, type: typeof food?.restaurantShortName, ok: typeof food?.restaurantShortName === 'string' },
            name: { value: food?.name, type: typeof food?.name, ok: typeof food?.name === 'string' },
            description: { value: food?.description, type: typeof food?.description, ok: typeof food?.description === 'string' },
            avgRating: { value: food?.avgRating, type: typeof food?.avgRating, ok: typeof food?.avgRating === 'number' },
            fullObject: food
        });
        return false;
    }
    console.log("Initial validation worked");

    if (food.review !== null && typeof food.review === 'object') {
        return (
            typeof food.review.review === 'string' &&
            typeof food.review.rating === 'number' &&
            typeof food.review.id === 'number'
        );
    }
    
    return true;
}
