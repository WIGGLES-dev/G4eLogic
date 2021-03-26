<script lang="ts">
    import Sidebar from "@components/Sidebar.svelte";
    import { System } from "@internal";
    import Router from "svelte-spa-router";
    import { push, pop, replace, link, querystring } from "svelte-spa-router";
    import qs from "querystring";
    import routes from "./app";
    import { upload } from "@utils/dom";
    import { merge } from "object-mapper";
    import { character as characterMap } from "@app/gurps/loadgcs";
    import Menu from "@components/Menu/Menu.svelte";
    import Option from "@components/Menu/Option.svelte";
    $: options = qs.parse($querystring);
    function setViewHome() {
        push("/");
    }
    async function uploadCharacter() {
        const files = await upload();
        const file = files[0];
        if (!file) return;
        const text = await file.text();
        const obj = JSON.parse(text);
        if (!obj) return;
        const character: any = merge(obj, characterMap);
        const key = character.id;
        const valid = System.validate(character);
        const exists = await System.get("index", key);
        if (exists) {
            System.update("index", key, character);
        } else {
            System.add("index", character, key);
        }
    }
</script>

<header>
    {#if !options.hideMenu}
        <menu class="menu">
            <i class="fas fa-home" on:click={setViewHome} />
            <i class="fas fa-upload" on:click={uploadCharacter} />
        </menu>
    {/if}
</header>
<main class="flex-1">
    <Router {routes} />
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
    .menu {
        @apply bg-gray-700 w-full flex m-0 p-0;
    }
</style>
