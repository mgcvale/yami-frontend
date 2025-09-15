export interface ReviewStats {
    averageRating: number
    ratingDistribution: {
        0: number,
        1: number,
        2: number,
        3: number,
        4: number,
        5: number,
        6: number,
        7: number,
        8: number,
        9: number,
        10: number,
        11: number,
        12: number,
        13: number,
        14: number,
        15: number,
        16: number,
        17: number,
        18: number,
        19: number,
        20: number,
    }
};

export function isReviewStats(rs: any): rs is ReviewStats {
    if (typeof rs !== 'object' || rs === null) return false;
    if (typeof rs.averageRating !== 'number') return false;

    const dist = rs.ratingDistribution;
    if (typeof dist !== 'object' || dist === null) return false;

    for (let i = 0; i <= 20; i++) {
        if (typeof dist[i] !== 'number') {
            return false;
        }
    }

    return true;
}
