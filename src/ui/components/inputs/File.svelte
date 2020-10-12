<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let filePicker;
</script>

<style>
</style>

<slot />
<input bind:this={filePicker} type="file" hidden />
