<script context="module">
    export let tooltip;
    export function render(tooltip) {}
</script>

<script>
    import { toTop } from "@ui/utils/use";
</script>

<style>
    
</style>

{#if tooltip}
    <div use:toTop>
        {@html tooltip}
    </div>
{/if}
