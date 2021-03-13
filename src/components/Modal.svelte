<script context="module" lang="ts">
    import { tick } from "svelte";
</script>

<script lang="ts">
    export let rendered = false;
    let dialog: HTMLDialogElement;
    export async function open() {
        rendered = true;
        await tick();
        dialog.showModal();
    }
    export function close() {
        rendered = false;
    }
</script>

{#if rendered}
    <dialog bind:this={dialog}>
        <slot />
    </dialog>
{/if}
<slot {dialog} name="button">
    <button on:click={open}>Open</button>
</slot>
