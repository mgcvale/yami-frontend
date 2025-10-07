export interface PublicUser {
    id: number,
    username: string,
    bio: string,
    location: string,
    followingCount: number,
    followerCount: number,
    reviewCount: number,
    following: boolean
};

export interface PublicUserWithoutCounts {
    id: number,
    username: string,
    bio: string,
    location: string,
    following: boolean
};

export function isPublicUserWithoutCounts(obj: any): obj is PublicUserWithoutCounts {
    return (
        typeof obj === "object" &&
        typeof obj.id === "number" &&
        typeof obj.username === "string" &&
        typeof obj.bio === "string" &&
        typeof obj.location === "string" &&
        typeof obj.following === "boolean"
    );
}

export function isPublicUser(obj: any): obj is PublicUser {
    return (
        typeof obj === "object" &&
        typeof obj.id === "number" &&
        typeof obj.username === "string" &&
        typeof obj.bio === "string" &&
        typeof obj.location === "string" &&
        typeof obj.followerCount === "number" &&
        typeof obj.followingCount === "number" &&
        typeof obj.reviewCount === "number" &&
        typeof obj.following === "boolean"
    );
}
