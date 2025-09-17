import { isRatingDistribution, type RatingDistribution } from "./rating-distribution";

export interface ReviewStats {
    averageRating: number
    ratingDistribution: RatingDistribution
};

export function isReviewStats(rs: any): rs is ReviewStats {
    if (typeof rs !== 'object' || rs === null) return false;
    if (typeof rs.averageRating !== 'number') return false;

    if (!isRatingDistribution(rs.ratingDistribution)) {
        return false;
    }

    return true;
}
