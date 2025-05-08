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
};