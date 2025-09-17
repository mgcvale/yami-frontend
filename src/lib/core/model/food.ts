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
        rating: number
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

    if (!initialMatch) return false;

    if (food.review !== null && typeof food.review === 'object') {
        return (
            typeof food.review.review === 'string' &&
            typeof food.review.rating === 'number'
        );
    }
    
    return true;
}
