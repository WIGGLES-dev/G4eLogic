<script context="module" lang="ts">
    export interface ContextMenuOption {
        label: string
        callback?: () => void
        show?: () => boolean
        options?: ContextMenuOption[]
        interactive?: boolean
    }
</script>
<script lang="ts">
    import { VirtualElement } from "@internal";
    import {createPopper } from "@popperjs/core";
    import { onDestroy, onMount } from "svelte";
    import Option from "./ContextMenuOption.svelte";
    let list;
    export let mouseEvent: MouseEvent;
    export const virtualElement = new VirtualElement();
    $: if (mouseEvent) {
        virtualElement.update(
            mouseEvent?.clientX,
            mouseEvent?.clientY
        );
    }
    export let popper: ReturnType<typeof createPopper>
    export let rendered = false
    export let options: ContextMenuOption[]
    export async function update({clientX, clientY}: MouseEvent) {
        virtualElement.update(clientX, clientY)
    }
    $: if (list instanceof HTMLElement) {
        popper = createPopper(virtualElement, list, {
            placement: 'bottom-start',
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [5,5]
                    }
                }
            ]
        });
    }
    export function close() {
        rendered = false;
        popper?.destroy();
    }
    onDestroy(close);
</script>

<style>

</style>

<svelte:window 
    on:scroll={close}
    on:click={close}
    on:contextmenu|capture={close}
/>

{#if options instanceof Array && rendered}
    <ul class='rounded bg-gray-500' bind:this={list}>
        {#each options as option, i (i)}
            <Option {option} {close}/> 
        {/each}
    </ul>
{/if}
