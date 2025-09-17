<script lang="ts">
    let { rating, className }: { rating: number, className: string } = $props();

    function ratingToTopPercent(rating: number): string {
        const erf = (x: number) => {
            const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
            const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
            const sign = x < 0 ? -1 : 1;
            x = Math.abs(x);
            const t = 1 / (1 + p * x);
            const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
            return sign * y;
        };

        rating = Math.max(0, Math.min(20, rating));
        const mean = 10, std = 3.5;
        const z = (rating - mean) / (std * Math.sqrt(2));
        const cdf = 0.5 * (1 + erf(z));
        const topPercent = Math.max(1, Math.round((1 - cdf) * 100));

        return `Top ${topPercent}%`;
    } // TODO: This is temporary while we dont have the percentage in the db
</script>

<div class="flex items-center justify-start ps-1 {className}">

    <span class="whitespace-nowrap text-lg font-bold
        {rating === 20 ? 'text-rating-top' :
        rating >= 15 ? 'text-rating-great' :
        rating >= 10 ? 'text-rating-good' :
        rating >= 5 ? 'text-rating-bad' :
        'text-rating-terrible'}"
    >
        {rating / 2} / 10
    </span>
    <span class="px-2 text-xl">•</span>
    <span class="whitespace-nowrap text-lg font-bold
        {rating === 20 ? 'text-rating-top' :
        rating >= 15 ? 'text-rating-great' :
        rating >= 10 ? 'text-rating-good' :
        rating >= 5 ? 'text-rating-bad' :
        'text-rating-terrible'}"
    >
        {ratingToTopPercent(rating)}
    </span>
</div>