<script lang="ts">
    import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { scale } from 'svelte/transition';

let { value = $bindable(5), min = 0, max = 10, step = 0.5, name, className="", disabled=$bindable(false)} = $props();

const sliderScale = spring(1, { stiffness: 0.3, damping: 0.8 });
const thumbScale = spring(1, { stiffness: 0.4, damping: 0.6 });
const valueScale = spring(1, { stiffness: 0.5, damping: 0.7 });

let isDragging = $state(false);
let isHovering = $state(false);


let originalOverscrollY: string;
onMount(() => {
    originalOverscrollY = document.body.style.overscrollBehaviorY || 'auto';
});


function handleMouseDown() {
    isDragging = true;
    thumbScale.set(1.2);
    sliderScale.set(1.02);
    document.body.style.overscrollBehaviorY = 'none';
}

function handleMouseUp() {
    isDragging = false;
    thumbScale.set(isHovering ? 1.1 : 1);
    sliderScale.set(isHovering ? 1.01 : 1);
    document.body.style.overscrollBehaviorY = originalOverscrollY;
}

function handleMouseEnter() {
  isHovering = true;
  if (!isDragging) {
    thumbScale.set(1.1);
    sliderScale.set(1.01);
  }
}

function handleMouseLeave() {
  isHovering = false;
  if (!isDragging) {
    thumbScale.set(1);
    sliderScale.set(1);
  }
}

$effect(() => {
    value;
    valueScale.set(1.1);
    setTimeout(() => valueScale.set(1), 100);
})

const percentage = $derived(((value - min) / (max - min)) * 100);

const ratingColor = $derived(
  value <= 2 ? 'rgb(185, 0, 0)' :
  value <= 4 ? 'rgb(214, 106, 0)' :
  value <= 6 ? 'rgb(185, 161, 0)' :
  value <= 9 ? 'rgb(84, 156, 0)' :
  'rgb(0, 127, 139)'
);

const ratingLabel = $derived(
  value <= 2 ? 'Terrível' : 
  value <= 3.5 ? 'Ruim' : 
  value <= 5.5 ? 'Decente' :
  value <= 7.5 ? 'Bom' : 
  value <= 9 ? 'Ótimo' :
  value <= 9 ? 'Divino' : 'Divino'
);

let dots = $derived([10, 20, 30, 40, 50, 60, 70, 80, 90].slice(Math.floor(value)));

</script>

<div class="relative origin-center overscroll-none flex flex-col gap-3 p-4 bg-light-field-bg dark:bg-dark-field-bg rounded-lg border-light-card-2 dark:border-dark-card-2 {disabled ? 'opacity-30' : ''}">
    <!-- Header -->
    <h3 class="text-light-fg-500 dark:text-dark-fg-500 font-alegreya text-lg font-medium">
        {name}
    </h3>

    <div class="relative flex items-center gap-4">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
        class="relative flex-1 h-2 cursor-pointer"
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
        >
            {#each [10, 20, 30, 40, 50, 60, 70, 80, 90] as v}
                {#if v !== value * 10}
                    <span class="absolute top-1/4 rounded-full w-1 h-1 z-10 {v <= (value * 10) ? "bg-light-subbg dark:bg-dark-subbg" : "bg-light-fg-50 dark:bg-dark-fg-50"}" style="left: calc({v}% - 4px)"></span>
                {/if}
            {/each}
        <div class="pointer-events-none absolute inset-0 bg-light-card-3 dark:bg-dark-card-3 rounded-full"></div>

        <div 
            class="absolute pointer-events-none left-0 top-0 h-full rounded-full transition-all duration-150 ease-out"
            style="width: {percentage}%; background-color: {ratingColor};"
        ></div>

        <div 
            class="absolute pointer-events-none top-1/2 w-3 h-8 translate-x-1 border-2 border-x-4 rounded-[4.5px] border-light-field-bg dark:border-dark-field-bg cursor-grab active:cursor-grabbing transition-all duration-150"
            style="left: calc({percentage}% - 10px);
                background-color: {ratingColor}; 
                transform: translateY(-50%);"
        ></div>

        <input
            type="range"
            oninput={(e) => { if (navigator.vibrate) navigator.vibrate(50); value = Number(e.currentTarget.value); }}
            onchange={(e) => { value = Number(e.currentTarget.value); }}            
            value={value}
            {min}
            {max}
            {step}
            class="absolute h-full w-full opacity-0 z-50 {disabled ? 'pointer-events-none' : ''}"
            onmousedown={handleMouseDown}
            ontouchstart={handleMouseDown}
            ontouchend={handleMouseUp}
            onmouseup={handleMouseUp}
        />
            {#if isDragging}
                <div 
                class="text-xs z-20 absolute origin-center bottom-0 shadow-lg left-1/2 -translate-x-1/2 p-4 rounded-lg bg-light-card-1 dark:bg-dark-card-1 text-light-fg-700 dark:text-dark-fg-700 font-dm-sans text-center transition-opacity duration-200 pointer-events-none"
                in:scale={{ duration: 150, delay: 50 }}
                style="transform: translateY(calc(100% + 16px));"
                >
                {ratingLabel}
                </div>
            {/if}
        </div>

        <div 
        class="flex items-center justify-center min-w-[3rem] h-8 px-2 border-2 rounded-md bg-light-card-2 dark:bg-dark-card-2 border-light-card-3 dark:border-dark-card-3"
        style="transform: scale({$valueScale}); transform-origin: center;"
        >
        {#key value}
            <span 
            class="text-light-fg-500 dark:text-dark-fg-500 font-dm-sans font-medium text-sm tabular-nums"
            in:scale={{ duration: 200, start: 0.8 }}
            style="color: {ratingColor};"
            >
            {value.toFixed(1)}
            </span>
        {/key}
        </div>
    </div>
</div>

<style>
  /*
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
  }
  
  input[type="range"]:focus {
    outline: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
  }
  
  input[type="range"]::-moz-range-thumb {
    border: none;
    background: transparent;
  }*/
  
  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(245, 224, 199, 0.4);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(245, 224, 199, 0.2);
    }
  }
  
  input[type="range"]:focus + div > div:last-of-type {
    animation: pulse-glow 2s infinite;
  }
</style>