<script>
    export let off = true;
    export let toggled = !off;
    export let on = !off;

    export let visible;
    function toggle() {
        toggled = !toggled;
        off = !off;
    }
</script>

<style>
</style>

{#if visible}
    <span
        data-container-toggle
        on:click={toggle}
        class="fas text-red-700"
        class:fa-angle-right={!toggled}
        class:fa-angle-down={toggled} />
{/if}
