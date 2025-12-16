<script lang="ts">
    import Card1 from "$lib/components/ui/cards/Card1.svelte";
    import Switch from "$lib/components/ui/controls/Switch.svelte";
    import { currentThemeLight } from "$lib/core/util/theme-manager";
    import { ChevronRight, Heart } from "@lucide/svelte";

    let lightThemeSwitchState = $state($currentThemeLight);
    currentThemeLight.subscribe(change => {
        if (!lightThemeSwitchState !== change) {
            lightThemeSwitchState = !change;
        }
    });

    $effect(() => {
        if ($currentThemeLight !== !lightThemeSwitchState) {
            currentThemeLight.set(!lightThemeSwitchState);
        }
    });
</script>

<div class="p-3 flex flex-col gap-2">

    <h1 class="font-alegreya text-2.5xl mb-5">Configurações do Yami</h1>
    <p class="text-light-fg-700 dark:text-dark-fg-500 pb-2">Essas configurações são persistentes neste dispositivo.</p>

    <Card1 className="w-full bg-light-card-2 dark:bg-dark-card-1 flex flex-col gap-2 justify-start items-start pt-2! mb-2">
        <h1 class="font-alegreya text-2xl pb-2">Visual</h1>
        <ul>
            <li class="flex justify-start items-center gap-3">
                <Switch bind:enabled={lightThemeSwitchState}></Switch>
                <span class="text-lg">Usar tema claro</span>
            </li>
        </ul> 
    </Card1>

    <Card1 className="w-full bg-light-card-2 dark:bg-dark-card-1 flex flex-col gap-2 justify-start items-start pt-2!">
        <h1 class="font-alegreya text-2xl pb-2">Arquivo</h1>
        <ul class="w-full">
            <li class="flex justify-start items-center gap-3 w-full">
                <a href="/app/settings/archive/liked-reviews" class="flex justify-start items-center gap-2 p-2 pt-3 rounded-md w-full grow bg-neutral-500/5 dark:bg-black/10 ">
                    <Heart /> Avaliações curtidas
                    <div class="grow"></div>
                    <ChevronRight />
                </a>
            </li>
        </ul> 
    </Card1>
</div>