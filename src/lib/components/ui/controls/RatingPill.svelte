<script lang="ts">

    let {
        rating
    }: {
        rating: number
    } = $props();

</script>

<span class="whitespace-nowrap font-bold
    {rating === 20 ? 'text-rating-top' :
    rating >= 15 ? 'text-rating-great' :
    rating >= 10 ? 'text-rating-good' :
    rating >= 5 ? 'text-rating-bad' :
    'text-rating-terrible'}"
>
    {rating / 2} / 10
</span>