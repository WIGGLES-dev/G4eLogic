<script lang="ts">
    import Sidebar from "@components/Sidebar.svelte";
    import { System } from "@internal";
    import Router from "svelte-spa-router";
    import { push, pop, replace, link, querystring } from "svelte-spa-router";
    import qs from "querystring";
    import routes from "./app";
    import { upload } from "@utils/dom";
    import { merge } from "@utils/object-mapper";
    import Menu from "@components/Menu/Menu.svelte";
    import Option from "@components/Menu/Option.svelte";
    $: ({ hideMenu } = qs.parse($querystring));
    function setViewHome() {
        push("/");
    }
    const { ready$ } = System;
</script>

{#if !hideMenu}
    <header>
        <menu class="menu">
            <i class="fas fa-home" on:click={setViewHome} />
        </menu>
    </header>
{/if}

<main class="flex-1">
    {#if $ready$}
        <Router {routes} />
    {:else}
        <!--  -->
    {/if}
</main>
<footer>
    <!--  -->
</footer>

<style lang="postcss">
    .fas {
        @apply text-white text-center p-1 flex-1;
    }
    .fas:hover {
        @apply text-gray-700 bg-gray-100;
    }
    header {
        @apply mb-6;
    }
    .menu {
        @apply bg-gray-700 fixed w-screen flex m-0 p-0 h-6;
    }
</style>
