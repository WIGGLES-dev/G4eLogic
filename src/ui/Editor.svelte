<script>
    import { setContext, onMount, onDestroy } from "svelte";

    import TitleBar from "@ui/menus/TitleBar";
    import Sheet from "./Sheet";

    $: view = "home";

    export let editor;
    const { store } = editor;

    function goHome() {
        view = "home";
        store.set(null);
    }

    export function newCharacter() {
        editor.newCharacter();
        view = "editor";
    }

    export async function loadCharacter(e) {
        const files = await editor.upload();
        const text = await files[0].text();
        const data = JSON.parse(text);
        editor.load(data);
    }

    function saveCharacter() {
        editor.save();
    }

    setContext("valor", {
        editor,
    });
</script>

<style>
    .option {
        @apply outline-none w-full p-4 my-16 bg-gray-700 text-white text-lg;
    }
    .option:hover {
        @apply bg-red-700;
    }
</style>

<template style="" />

<svelte:head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="favicon.png" />
    <link rel="stylesheet" href="test.css" />
    <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossorigin="anonymous" />
    <title>Valor Character Builder</title>
</svelte:head>

<TitleBar>
    <div on:click={goHome} slot="title" class="flex">
        <img src="favicon.png" alt="logo" class="h-8 pr-1 cursor-pointer" />
        <span class="mr-3"> Valor Character Builder </span>
    </div>
    <div class="h-full flex">
        <div class="inline-block ml-auto">
            <span
                on:click={loadCharacter}
                class="fas fa-file-upload align-bottom" />
            <span
                class="fas fa-file-download align-bottom"
                on:click={saveCharacter} />
        </div>
    </div>
</TitleBar>

<main>
    {#if $store && view === 'editor'}
        <Sheet character={store} />
    {:else if !$store || view === 'home'}
        <section class="flex">
            <div class="mx-48 flex flex-col">
                <button on:click={newCharacter} class="option">Create a New
                    Character</button>
                <button on:click={loadCharacter} class="option">Load An Existing
                    Character</button>
                <button class="option">Read Documentation</button>
                <a
                    class="underline"
                    href="https://www.patreon.com/bePatron?u=27866887">Become a
                    Patron!</a>
            </div>
            <div class="flex-1" />
        </section>
    {/if}
</main>
