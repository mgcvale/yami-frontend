<script lang="ts">
    import type ReviewStats from "$lib/core/model/reviewStats";
    import { onMount } from "svelte";
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Filler,
        Tooltip, type Point,
    } from 'chart.js';
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);
    let { className = "", name, stats }: {
        className: string,
        name: string | null,
        stats: ReviewStats
    } = $props();


    let canvas: HTMLCanvasElement;
    function renderChart(darkmode: boolean) {
        const ctx = canvas.getContext("2d");
        const gradient = ctx?.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient?.addColorStop(0, 'rgba(190, 176, 158, 0.5)');
        gradient?.addColorStop(1, 'rgba(190, 176, 158, 0)');

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: Array.from({length: 21}, (_, i) => (i * 0.5).toFixed(1)),
                datasets: [{
                    data: Object.values(stats.ratingDistribution),
                    borderColor: '#beb09e',
                    backgroundColor: gradient ?? 'rgba(0, 0, 0, 0)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 0,
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                devicePixelRatio: 1,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            autoSkip: false,
                            callback: function(value, index, ticks) {
                                if ([0, 5, 10, 15, 20].includes(index)) {
                                    console.log(index);
                                    return this.getLabelForValue((value as number));
                                }
                                return '';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 8,
                            autoSkip: false,
                        }
                    }
                }
            }
        });
    }

    onMount(() => {
        renderChart(true);
    });


</script>

<div class="w-full h-fit flex {className}">
    <div class="bg-light-card-1 dark:bg-dark-card-1 rounded-xl w-full px-2 py-1 flex gap-2 flex-col justify-start items-start">
        <span class="pl-1 text-light-fg-100 dark:text-dark-fg-300 font-alegreya-sans font-normal text-xl">
            {#if name != null}
                {name}'s average rating: {stats.averageRating}/10
            {:else}
                Rating distribution
            {/if}
        </span>
        <canvas class="grow" bind:this={canvas}></canvas>
    </div>
</div>


