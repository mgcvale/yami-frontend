<script lang="ts">
    import { Search, Home, PlusCircle, User } from '@lucide/svelte';
    import { page } from '$app/state';
    import { Modal } from '$lib';
    import Logo from '$lib/components/ui/Logo.svelte';

    let { children } = $props();

    console.log(page.url.pathname);
</script>

<header 
    class="sticky top-0 left-0 w-dvw h-16 flex justify-between items-center p-2.5 rounded-b-lg
     dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500"
>
    <a href="/" aria-label="logo" class="max-h-full w-fit h-9/12 color-dark-fg-500 *:h-full *:w-auto *:dark:text-dark-fg-500 *:text-light-fg-500">
        <Logo />
    </a>

    <div class="flex justify-cent gap-5 px-2">
        <Search width={32}/>
        <User className="h-full w-auto"/>
    </div>
</header>

<main>
    {@render children()}
</main>

<Modal />

<nav
    class="fixed bottom-0 left-0 w-dvw h-18 flex items-center justify-center p-3 px-0 rounded-t-lg 
    dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500"
>
    <ul class="flex items-center justify-around w-full h-full text-sm">
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <a href="/" class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3": page.url.pathname === "/app"}]}>
                <Home size=20 class="m-auto"/>
            </a>
            <span>Home</span>
        </li>
        <li class={["flex flex-col justify-between items-center h-full -translate-y-1"]} >
            <a href="/app/review/create" class={["w-16 rounded-full flex justify-center align-center h-7", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3":  page.url.pathname.startsWith("/app/review/create")}]}>
                <PlusCircle size=26 class="m-auto"/>
            </a>
            <span class="text-[1.05rem]">Create</span>
        </li>
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <a href="/app/user" class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3": page.url.pathname === "/app/user"}]}>
                <User size=20 class="m-auto"/>
            </a>
            <span>Profile</span>
        </li>
    </ul>
</nav>