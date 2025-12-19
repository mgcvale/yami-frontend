import { verifyObject } from "./type-checkers";


export interface BasicRestaurant {
    id: number;
    name: string;
    shortName: string;
    description: string;
}

export interface Restaurant extends BasicRestaurant {
    id: number;
    name: string;
    shortName: string;
    description: string;
    reviewCount: number;
    foodCount: number;
    location?: string;
    following: boolean;
    followerCount: number;
}

export function isBasicRestaurant(restaurant: any): restaurant is BasicRestaurant {
    const schema: Record<keyof BasicRestaurant, string> = {
        id: 'number',
        name: 'string',
        shortName: 'string',
        description: 'string'
    };

    return verifyObject(restaurant, schema);
}

export function isRestaurant(restaurant: any): restaurant is Restaurant {
    const schema: Record<keyof Restaurant, string> = {
        id: 'number',
        name: 'string',
        shortName: 'string',
        description: 'string',
        reviewCount: 'number',
        foodCount: 'number',
        location: 'string?',
        following: 'boolean',
        followerCount: 'number'
    };

    return verifyObject(restaurant, schema);
}
