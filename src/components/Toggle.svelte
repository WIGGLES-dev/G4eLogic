<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let toggled = false;
    export let visible = true;
    let classList = "";
    export {classList as class}
    export let style;
    function toggle(e) {
        toggled = !toggled
        dispatch('toggle', toggled);
    }
</script>

<style>
    .toggle {
        @apply flex flex-col justify-center;
    }
</style>

{#if visible}
    <span
        data-toggle
        on:click={toggle}
        class="fas toggle {classList}"
        class:fa-angle-right={!toggled}
        class:fa-angle-down={!!toggled}
        {style}
    />
{/if}
