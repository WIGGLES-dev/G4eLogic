<script>
    import { createEventDispatcher } from "svelte";
    export const dispatch = createEventDispatcher();
    export let toggled = false;
    let classList = "";
    export { classList as class };
    export let style = "";
    function toggle(e) {
        toggled = !toggled;
        dispatch("toggle", toggled);
    }
</script>

<i
    data-toggle
    on:click={toggle}
    data-toggled={toggled}
    class="fas {classList}"
    class:fa-angle-right={toggled === false}
    class:fa-angle-down={toggled === true}
    {style}
/>

<style lang="postcss">
    [data-toggle] {
        @apply flex flex-col justify-center cursor-pointer;
    }
    .open {
    }
    .close {
    }
</style>
