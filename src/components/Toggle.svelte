<script>
    import { createEventDispatcher } from "svelte";
    export const dispatch = createEventDispatcher();
    export let toggled = false;
    export let visible = true;
    let classList = "";
    export { classList as class };
    export let style;
    function toggle(e) {
        toggled = !toggled;
        dispatch("toggle", toggled);
    }
</script>

{#if visible}
    <i
        data-toggle
        on:click={toggle}
        data-toggled={toggled}
        class="fas {classList}"
        class:fa-angle-right={!toggled}
        class:fa-angle-down={!!toggled}
        {style}
    />
{/if}

<style lang="postcss">
    [data-toggle] {
        @apply flex flex-col justify-center cursor-pointer;
    }
</style>
