<script lang="ts">
    import { Search, Home, PlusCircle, User, LogOut, Bolt } from '@lucide/svelte';
    import { page } from '$app/state';
    import { currentUserStore, Modal } from '$lib';
    import Logo from '$lib/components/ui/Logo.svelte';
    import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
    import { appState } from '$lib/core/util/appState';
    import { onMount } from 'svelte';
    import type ContextMenuEntry from '$lib/core/types/contextMenuEntry';
    import { logout } from '$lib/core/actions/account/logout';
    import { goto } from '$app/navigation';
    import SnackBar from '$lib/components/util/SnackBar.svelte';

    let { children } = $props();

    let showingUserContextMenu = $state(false);

    onMount(() => { 
        $appState.globalOnClick.push(e => {
            showingUserContextMenu = false;
        });
    });

    let contextMenuEntries: ContextMenuEntry[] = $state([
        {
            name: "loading...",
            action: () => {}
        }
    ]);

    currentUserStore.subscribe(change => {
        if (change.loading) {
            contextMenuEntries = [{
                name: "loading...",
                action: () => {}
            }];
            return;
        }

        if (change.data !== null) {
            contextMenuEntries = [
                {
                    name: "Log out",
                    action: () => {
                        logout(() => goto('/account/login', {
                            replaceState: true,
                        }));
                    },
                    icon: LogOut
                },
                {
                    name: "Your profile",
                    action: () => {
                        goto('/app/user', {
                            replaceState: false,
                        });
                    },
                    icon: User
                },
                {
                    name: "Settings",
                    action: () => {
                        goto('/app/settings', {
                            replaceState: false,
                        });
                    },
                    icon: Bolt
                }
            ];
        } else {
            contextMenuEntries = [
                {
                    name: "Log in",
                    action: () => {
                        goto('/account/login', {
                            replaceState: true,
                        });
                    }
                },
                {
                    name: "Register",
                    action: () => {
                        goto('/account/register', {
                            replaceState: true,
                        });
                    }
                }
            ]
        }
    });
</script>

<header 
    class="fixed top-0 -translate-x-1/2 left-1/2 w-full max-w-[500px] h-16 flex justify-between items-center p-2.5 rounded-b-lg
     dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500"
>
    <a href="/" aria-label="logo" class="max-h-full w-fit h-9/12 color-dark-fg-500 *:h-full *:w-auto *:dark:text-dark-fg-500 *:text-light-fg-500">
        <Logo />
    </a>

    <div class="flex justify-center gap-5 px-2">
        <div class="relative flex jstify-center items-center">
            <Search width={32} className="h-full w-auto" onclick={e => {
                goto("/app?context=searching");
            }}/>
        </div>
        <div class="relative flex justify-center items-center">
            <ContextMenu bind:entries={contextMenuEntries}
                bind:showing={showingUserContextMenu}>
            </ContextMenu>
            <User className="h-full w-auto" onclick={e => {
                showingUserContextMenu = true;
                e.stopPropagation();
            }}>
                
            </User>
        </div>
    </div>
</header>

<main class="pb-18 pt-16 bg-light-bg dark:bg-dark-bg">
    {@render children()}
</main>

<Modal />
<SnackBar />

<nav
    class="fixed bottom-0 -translate-x-1/2 left-1/2 w-full max-w-[500px] h-18 flex items-center justify-center p-3 px-0 rounded-t-lg 
    dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500"
>
    <ul class="flex items-center justify-around w-full h-full text-sm">
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <a onclick={() => goto('/app', {replaceState: false})} class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3": page.url.pathname === "/app"}]}>
                <Home size=20 class="m-auto"/>
            </a>
            <span>Home</span>
        </li>
        <li class={["flex flex-col justify-between items-center h-full -translate-y-1"]} >
            <a onclick={() => goto('/app/review/create', {replaceState: false})} class={["w-16 rounded-full flex justify-center align-center h-7", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3":  page.url.pathname.startsWith("/app/review/create")}]}>
                <PlusCircle size=26 class="m-auto"/>
            </a>
            <span class="text-[1.05rem]">Create</span>
        </li>
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <a onclick={() => goto('/app/user', {replaceState: false})} class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3": page.url.pathname === "/app/user"}]}>
                <User size=20 class="m-auto"/>
            </a>
            <span>Profile</span>
        </li>
    </ul>
</nav>