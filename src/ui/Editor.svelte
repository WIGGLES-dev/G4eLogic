<script>
    import { setContext, onMount, onDestroy } from "svelte";
    import { derived, writable } from "svelte/store";

    import TitleBar from "@ui/components/menus/TitleBar";
    import Sheet from "./Sheet";

    import ContextMenu from "@ui/components/context-menu/ContextMenu";
    import Tooltips from "@ui/components/tooltips/Tooltip";
    import Applications from "@ui/components/applications/ApplicationManager.svelte";
    import Notifications from "@ui/components/applications/Notifications.svelte";

    import { Character } from "index";

    $: view = "home";

    export let editor;

    const characterStore = writable(null);

    function goHome() {
        view = "home";
        characterStore.set(null);
    }

    const subscriptions = new Map();
    function cleanup() {
        [subscriptions.values()].forEach((subscription) =>
            subscription.unsubscribe()
        );
    }
    onDestroy(cleanup);
    export function newCharacter(data) {
        if (subscriptions.has($characterStore))
            subscriptions.get($characterStore).unsubscribe();
        const character = new Character();
        if (data) character.load(data, "GCSJSON");
        editor.character = character;
        subscriptions.set(
            character,
            character.subscribe((character) => {
                characterStore.set(character);
            })
        );
        view = "editor";
    }

    export async function loadCharacter(e) {
        Object.assign(document.createElement("input"), {
            type: "file",
            async onchange() {
                const file = this.files[0];
                const data = JSON.parse(await file.text());
                newCharacter(data);
                view = "editor";
            },
        }).click();
    }

    function saveCharacter() {
        const character = $characterStore;
        if (!character) return;
        const json = character.save();
        const text = JSON.stringify(json);
        Object.assign(document.createElement("a"), {
            href: "data:text/json;charset=utf-8," + encodeURIComponent(text),
            download: `${character.profile.name || "???"}.gcs`,
        }).click();
    }

    const ui = {
        contextMenu: null,
        modals: null,
        tooltips: null,
        notifications: null,
    };

    setContext("app", {
        components: ui,
        character: characterStore,
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
    <div slot="title" class="flex">
        <img
            on:click={goHome}
            src="favicon.png"
            alt="logo"
            class="h-8 pr-1 cursor-pointer" />
        <span class="mr-3" on:click={() => console.log($characterStore)}>
            Valor Character Builder
        </span>
        <!-- <a
            class="underline"
            href="https://www.patreon.com/bePatron?u=27866887">Become a Patron!</a> -->
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

<ContextMenu bind:this={ui.contextMenu} />
<Applications bind:this={ui.modals} />
<Tooltips bind:this={ui.tooltips} />
<Notifications bind:this={ui.notifications} />

<main>
    {#if $characterStore && view === 'editor'}
        <Sheet />
    {:else if !$characterStore || view === 'home'}
        <section class="flex">
            <div class="mx-48 flex flex-col">
                <button on:click={newCharacter} class="option">Create a New
                    Character</button>
                <button on:click={loadCharacter} class="option">Load An Existing
                    Character</button>
                <button class="option">Read Documentation</button>
            </div>
            <div class="flex-1" />
        </section>
    {/if}
</main>
