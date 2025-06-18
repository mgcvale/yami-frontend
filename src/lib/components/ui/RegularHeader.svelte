<script lang="ts">
    import { isSearching } from "$lib/core/store/isSearchingStore";
    import { Bolt, LogOut, MapPinHouse, Sandwich, Search, User } from "@lucide/svelte";
    import Logo from "./Logo.svelte";
    import ContextMenu from "./controls/ContextMenu.svelte";
    import { appState } from "$lib/core/util/appState";
    import { onMount } from "svelte";
    import type ContextMenuEntry from "$lib/core/types/contextMenuEntry";
    import { logout } from "$lib/core/actions/account/logout";
    import { goto } from "$app/navigation";
    import { currentUserStore } from "$lib/core/store/currentUserStore";

    let showingUserContextMenu = $state(false);
    let shwoingSearchContextMenu = $state(false);

    $effect(() => {
        if (showingUserContextMenu) {
            shwoingSearchContextMenu = false;
        }
        if (shwoingSearchContextMenu) {
            showingUserContextMenu = false;
        }
    });

    onMount(() => { 
        $appState.globalOnClick.push(e => {
            showingUserContextMenu = false;
        });
    });

    const searchContextMenuEntries: ContextMenuEntry[] = $state([
        {
            name: "User",
            icon: User,
            action: () => {
                goto("/app?context=search&for=user");
                isSearching.set(true);
            }
        },
        {
            name: "Food",
            icon: Sandwich,
            action: () => {
                goto("/app?context=search&for=food");
                isSearching.set(true);
            }
        },
        {
            name: "Restaurant",
            icon: MapPinHouse,
            action: () => {
                goto("/app?context=search&for=restaurant");
                isSearching.set(true);
            }
        },
    ]);

    let accountContextMenuEntries: ContextMenuEntry[] = $state([
        {
            name: "loading...",
            action: () => {}
        }
    ]);


    currentUserStore.subscribe(change => {
        if (change.loading) {
            accountContextMenuEntries = [{
                name: "loading...",
                action: () => {}
            }];
            return;
        }

        if (change.data !== null) {
            accountContextMenuEntries = [
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
            accountContextMenuEntries = [
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
     dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500 z-50"
>
    <a href="/" aria-label="logo" class="max-h-full w-fit h-9/12 color-dark-fg-500 *:h-full *:w-auto *:dark:text-dark-fg-500 *:text-light-fg-500">
        <Logo />
    </a>

    <div class="flex justify-center gap-5 px-2">
        <div class="relative flex justify-center items-center">
            <Search width={32} className="h-full w-auto" onclick={e => {    
                shwoingSearchContextMenu = true;
                e.stopPropagation();
            }}/>
            <ContextMenu
                entries={searchContextMenuEntries}
                bind:showing={shwoingSearchContextMenu}
            />
        </div>
        <div class="relative flex justify-center items-center">
            <ContextMenu 
                bind:entries={accountContextMenuEntries}
                bind:showing={showingUserContextMenu}
            />
            <User className="h-full w-auto" onclick={e => {
                showingUserContextMenu = true;
                e.stopPropagation();
            }}/>
        </div>
    </div>
</header>
