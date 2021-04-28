<svelte:options accessors={true} />

<script context="module" lang="ts">
    const systemctx = Symbol("system");
</script>

<script lang="ts">
    import { writable } from "svelte/store";
    import Toast from "@components/Toast.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import Router from "svelte-spa-router";
    import { push, pop, replace, link, querystring } from "svelte-spa-router";
    import qs from "querystring";
    import routes from "./app";
    import { upload } from "@utils/dom";
    import { merge } from "@utils/object-mapper";
    import { ScreenSize, screensize$ } from "@internal";
    $: ({ hideMenu } = qs.parse($querystring));
    export let system;
    $: ({ ready$ } = system);
    function setViewHome() {
        push("/");
    }
    export let toast: Toast;
    export let sidebar: Sidebar;
    export let sidebarOffset: number;
</script>

<svelte:window />

<Sidebar
    bind:this={sidebar}
    let:collapse
    bind:offset={sidebarOffset}
    style="width:{$screensize$ === ScreenSize.S_SM ? '70%' : '25%'};"
>
    <menu class="h-full flex flex-col" on:click={collapse}>
        <i
            class="fas fa-home w-full flex flex-col justify-center"
            on:click={setViewHome}
        />
    </menu>
</Sidebar>
<Toast class="fixed bottom-0 right-0 m-5" bind:this={toast} />
<header>
    <i
        class="icon fas fa-bars flex-shrink-0 ml-auto"
        on:click={(e) => sidebar.toggle()}
    />
</header>
<main>
    {#if $ready$}
        <Router
            {routes}
        />
    {:else}
        <!--  -->
    {/if}
</main>
<footer>
    <!--  -->
</footer>

<style lang="postcss">
    .fas {
        @apply text-white text-center p-3;
    }
    .fas:hover {
        @apply text-gray-700 bg-gray-100;
    }
    header {
        @apply flex bg-gray-500 sticky top-0;
    }
    main {
    }
    .content {
    }
    .menu {
        @apply bg-gray-700 w-full flex m-0 p-0 children:flex-1;
    }
</style>
