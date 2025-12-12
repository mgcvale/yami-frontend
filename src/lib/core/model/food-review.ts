export interface FoodReview {
    id: number,
    userId: number,
    username: string,
    foodId: number,
    foodName: string,
    restaurantId: number,
    restaurantName: string,
    restaurantShortName: string
    review: string,
    rating: number,
    liked: boolean,
    likeCount: number
};

export function isFoodReview(fr: any): fr is FoodReview {
    return (
        typeof fr === 'object' &&
        fr !== null &&
        typeof fr.id === 'number' &&
        typeof fr.userId === 'number' &&
        typeof fr.username === 'string' &&
        typeof fr.foodId === 'number' &&
        typeof fr.foodName === 'string' &&
        typeof fr.restaurantId === 'number' &&
        typeof fr.restaurantName === 'string' &&
        typeof fr.restaurantShortName === 'string' &&
        typeof fr.review === 'string' &&
        typeof fr.rating === 'number' &&
        typeof fr.liked === 'boolean' &&
        typeof fr.likeCount === 'number'
    );
}
