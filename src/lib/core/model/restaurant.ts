import { verifyObject } from "./type-checkers";

export interface Restaurant {
    id: number;
    name: string;
    shortName: string;
    description: string;
    reviewCount: number;
    foodCount: number;
    location?: string;
}

export function isRestaurant(restaurant: any): restaurant is Restaurant {
    const schema: Record<keyof Restaurant, string> = {
        id: 'number',
        name: 'string',
        shortName: 'string',
        description: 'string',
        reviewCount: 'number',
        foodCount: 'number',
        location: 'string?'
    };

    return verifyObject(restaurant, schema);
}
