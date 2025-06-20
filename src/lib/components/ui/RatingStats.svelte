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
        Tooltip,
    } from "chart.js";
    import type { AsyncState } from "$lib/core/types/asyncState";

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Filler,
        Tooltip,
    );

    let currentChart: Chart | null = $state(null);
    let {
        className = "",
        name,
        stats = $bindable(),
    }: {
        className: string;
        name: string | null;
        stats: AsyncState<ReviewStats>;
    } = $props();
    let canvas: HTMLCanvasElement | null = $state(null);

    function createChart(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        const gradient = ctx?.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient?.addColorStop(0, "rgba(190, 176, 158, 0.5)");
        gradient?.addColorStop(1, "rgba(190, 176, 158, 0)");

        currentChart = new Chart(canvas, {
            type: "line",
            data: {
                labels: Array.from({ length: 21 }, (_, i) => (i * 0.5).toFixed(1) ),
                datasets: [{
                    data: [],
                    borderColor: "#beb09e",
                    backgroundColor: gradient ?? "rgba(0, 0, 0, 0)",
                    fill: true,
                    tension: 0.35,
                    pointRadius: 0,
                    borderWidth: 2,
                },],
            },
            options: {
                responsive: true,
                devicePixelRatio: 1,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            autoSkip: false,
                            callback: function (value, index, ticks) {
                                if ([0, 5, 10, 15, 20].includes(index)) {
                                    console.log(index);
                                    return this.getLabelForValue(value as number);
                                }
                                return "";
                            },
                        },
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            maxTicksLimit: 8,
                            autoSkip: false,
                        },
                    },
                },
            },
        });
    }

    function updateChartData() {
        if (!currentChart || stats.loading || !stats.data) return;

        currentChart.data.datasets[0].data = Object.values(
            stats.data.ratingDistribution,
        );
        currentChart.update();
    }

    $effect(() => {
        if (!canvas) return;

        createChart(canvas);

        return () => {
            if (currentChart) {
                currentChart.destroy();
                currentChart = null;
            }
        };
    });

    $effect(() => {
        updateChartData();
    });

</script>

<div class="w-full h-fit flex {className}">
    <div
        class="bg-light-card-1 dark:bg-dark-card-1 rounded-xl w-full px-2 py-1 flex gap-2 flex-col justify-start items-start min-h-24"
    >
        <span
            class="pl-1 text-light-fg-100 dark:text-dark-fg-300 font-alegreya-sans font-normal text-xl"
        >
            {#if stats.loading}
                Loading data...
            {:else if stats.data === null}
                Error loading stats
            {:else if name != null}
                {name}'s average rating: {(
                    stats.data.averageRating / 2
                ).toFixed(1)} / 10
            {:else}
                Rating distribution
            {/if}
        </span>
        <div class="h-full w-full flex justify-center align-center flex-col">
            {#if stats.loading}
                Loading stats...
            {:else if stats.error !== null}
                {#if stats.error.status === 404}
                    <span class="text-light-error dark:text-dark-error"
                        >Error 404: This user doesn't seem to exist.</span
                    >
                {:else if stats.error.status === 403}
                    <span class="text-light-error dark:text-dark-error"
                        >Error 403: You don't have access to this data.</span
                    >
                {:else if stats.error.status === 401}
                    <span class="text-light-error dark:text-dark-error"
                        >Error 401: You must be authenticated to see this data.</span
                    >
                {:else if stats.error instanceof TypeError}
                    <span class="text-light-error dark:text-dark-error"
                        >A network error occurred. Check if your'e connected to
                        the internet and try again.</span
                    >
                {:else}
                    <span class="text-light-error dark:text-dark-error"
                        >An unknown error occurred. Error status: {stats.error
                            .status}</span
                    >
                {/if}
            {:else if stats.data !== null}
                <canvas class="grow" bind:this={canvas}></canvas>
            {:else}
                <span
                    >An unknown error occurred while processing your data.</span
                >
            {/if}
        </div>
    </div>
</div>
