<script>
    export let draggable = false;
    export let virtualElement = null;

    import { toTop } from "@ui/utils/use";
</script>

<style>
</style>

<section use:toTop class="absolute">
    <slot />
</section>
