export interface CreateUserDTO {
    accessToken: string;
    id: number;
    username: string;
    email: string;
    followerCount: number;
    followingCount: number;
    reviewCount: number;
}

export function isCreateUserDTO(dto: any): dto is CreateUserDTO {
  return (
    typeof dto === 'object' &&
    dto !== null &&
    typeof dto.accessToken === 'string' &&
    typeof dto.id === 'number' &&
    typeof dto.username === 'string' &&
    typeof dto.email === 'string' &&
    typeof dto.followerCount === 'number' &&
    typeof dto.followingCount === 'number' &&
    typeof dto.reviewCount === 'number'
  );
}
