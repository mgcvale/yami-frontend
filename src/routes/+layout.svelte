<script lang="ts">
    import { Bolt, Search, Home, PlusCircle, User } from '@lucide/svelte';
    import '../app.css';
    import { onMount } from 'svelte';
    import { page } from '$app/state';

    let { children } = $props();

    let svg: string = $state("");

    onMount(async () => {
        const res = await fetch('/yami/yami-logo.svg');
        svg = await res.text();
    });

    console.log(page.url.pathname);
</script>

<header 
    class="sticky top-0 left-0 w-dvw h-16 flex justify-between items-center p-2.5 rounded-b-lg
     dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500"
>
    <a href="/" class="max-h-full w-fit h-9/12 color-dark-fg-500 *:h-full *:w-auto *:dark:text-dark-fg-500 *:text-light-fg-500">
        {@html svg}
    </a>

    <div class="flex justify-cent gap-5 px-2">
        <Search width={32}/>
        <Bolt className="h-full w-auto"/>
    </div>
</header>

<main>
    {@render children()}
</main>

<nav
    class="fixed bottom-0 left-0 w-dvw h-18 flex items-center justify-center p-3 px-0 rounded-t-lg 
    dark:bg-dark-card-3 bg-light-card-3 *:dark:text-dark-fg-500 *:text-light-fg-500"
>
    <ul class="flex items-center justify-around w-full h-full text-sm">
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <a href="/" class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3": page.url.pathname === "/"}]}>
                <Home size=20 class="m-auto"/>
            </a>
            <span>Home</span>
        </li>
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <a href="/" class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3":  page.url.pathname.startsWith("/create_review")}]}>
                <PlusCircle size=20 class="m-auto"/>
            </a>
            <span>Create</span>
        </li>
        <li class={["flex flex-col justify-between items-center h-full"]} >
            <a href="/user?id=-1" class={["w-14 rounded-full flex justify-center align-center h-6", {"bg-light-fg-500 dark:bg-dark-fg-500 text-light-card-2 dark:text-dark-card-3": page.url.pathname.startsWith("/user")}]}>
                <User size=20 class="m-auto"/>
            </a>
            <span>Profile</span>
        </li>
    </ul>
</nav>