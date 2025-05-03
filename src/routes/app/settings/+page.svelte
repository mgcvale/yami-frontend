<script lang="ts">
    import { currentUserStore, modalStore, type CurrentUser } from "$lib";
    import Card1 from "$lib/components/ui/Card1.svelte";
    import LoginAsker from "$lib/components/ui/LoginAsker.svelte";
    import Switch from "$lib/components/ui/Switch.svelte";
    import type { AsyncState } from "$lib/core/types/asyncState";
    import { currentThemeLight } from "$lib/core/util/themeManager";

    function load(currentuser: AsyncState<CurrentUser>) {
        if (currentuser.loading) return;
        if (currentuser.data !== null) return;

        modalStore.set({
            component: LoginAsker,
            props: {
                actionName: "change your settings"
            }
        });
    }

    currentUserStore.subscribe(newUser => {
        load(newUser);
    });

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

<div class="p-3">

    <h1 class="font-alegreya text-2.5xl mb-5">Yami settings</h1>
    <p class="text-light-fg-700 dark:text-dark-fg-500 pb-2">These settings are synced acrross your account.</p>

    <Card1 className="w-full bg-light-card-2 dark:bg-dark-card-1 flex flex-col gap-2 justify-start items-start pt-2!">
        <h1 class="font-alegreya text-z2xl pb-2">Visuals</h1>
        <ul>
            <li class="flex justify-start items-center gap-3">
                <Switch bind:enabled={lightThemeSwitchState}></Switch>
                <span class="text-lg">Use light theme</span>
            </li>
        </ul> 
    </Card1>
</div>