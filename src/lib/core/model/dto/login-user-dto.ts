import { verifyObject } from "../type-checkers";

export interface LoginUserDTO {
    id: number;
    username: string;
    email: string;
    accessToken: string;
    bio: string;
    location: string;
    followerCount: number;
    followingCount: number;
    reviewCount: number;
}

export function isLoginUserDTO(obj: any): obj is LoginUserDTO {
    const schema: Record<keyof LoginUserDTO, 'string' | 'number'> = {
        id: 'number',
        username: 'string',
        email: 'string',
        accessToken: 'string',
        bio: 'string',
        location: 'string',
        followerCount: 'number',
        followingCount: 'number',
        reviewCount: 'number',
    };

    return verifyObject(obj, schema);
}
