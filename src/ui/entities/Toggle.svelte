<script lang='ts'>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let off = true;
    export let on = !off;
    export let visible;
    function toggle(e) {
        off = !off;
        on = !on;
        dispatch('toggle', {
            off,
            on
        });
    }
</script>

<style>
</style>

{#if visible}
    <span
        data-toggle
        on:click={toggle}
        class="fas text-red-700"
        class:fa-angle-right={!!off}
        class:fa-angle-down={!!!off} />
{/if}
