<script>
    export let off = true;
    export let on = !off;
    export let visible = true;
    let classList = "";
    export {classList as class}
    export let style;
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
    .toggle {
        @apply flex flex-col justify-center;
    }
</style>

{#if visible}
    <span
        data-toggle
        on:click={toggle}
        class="fas toggle {classList}"
        class:fa-angle-right={!!off}
        class:fa-angle-down={!!!off}
        {style}    
    />
{/if}
