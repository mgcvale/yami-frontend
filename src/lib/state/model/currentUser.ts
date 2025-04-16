import type PublicUser from "./publicUser";

export default interface CurrentUser extends PublicUser {
    accessToken: string,
    email: string
};