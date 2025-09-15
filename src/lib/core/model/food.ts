export interface Food {
    id: number;
    restaurantId: number,
    restaurantName: string,
    name: string,
    description: string, 
    avgRating: number
};

export function isFood(food: any): food is Food {
    return (
        food !== null &&
        typeof food === 'object' &&
        typeof food.id === 'number' &&
        typeof food.restaurantId === 'number' &&
        typeof food.restaurantName === 'string' &&
        typeof food.name === 'string' &&
        typeof food.description === 'string' &&
        typeof food.avgRating === 'number'
    );
}
