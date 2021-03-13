<script lang="ts">
    import Sidebar from "@components/Sidebar.svelte";
    import { System, Resource } from "@internal";
    import Router from "svelte-spa-router";
    import Editor from "@ui/editors/Editor.svelte";
    import Home from "@ui/Home.svelte";
    import { push, pop, replace, link, querystring } from "svelte-spa-router";
    import routes from "./app";
    function setViewHome() {
        push("/");
    }
    async function createCharacter() {
        const created = await Resource.create({ type: "character" });
    }
</script>

<header class="bg-gray-700">
    <section class="flex">
        <i class="fas fa-home" on:click={setViewHome} />
        <i class="fas fa-user" on:click={createCharacter} />
        <i class="fas fa-upload" />
        <i class="fas fa-info-square" />
    </section>
</header>
<main class="flex-1">
    <Router {routes} />
</main>

<style lang="postcss">
    .fas {
        @apply text-white text-center p-1 flex-1;
    }
    .fas:hover {
        @apply text-gray-700 bg-gray-100;
    }
</style>
