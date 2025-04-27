import type PublicUser from "./publicUser";

export default interface CurrentUser extends PublicUser {
    accessToken: string,
    email: string
};


export function isCurrentUser(obj: any): obj is CurrentUser {
    return (
        typeof obj === "object" &&
        typeof obj.id === "number" &&
        typeof obj.username === "string" &&
        typeof obj.bio === "string" &&
        typeof obj.location === "string" &&
        typeof obj.followerCount === "number" &&
        typeof obj.followingCount === "number" &&
        typeof obj.reviewCount === "number" &&
        typeof obj.accessToken === "string" &&
        typeof obj.email === "string"
    );
}