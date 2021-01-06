<script lang="ts">
    import { isStore } from "@components/Observe.svelte";
    export let value: any;
    export let width;
    export let disabled: boolean
    $: style = `
        flex: 1;
        width: ${width};
    `;
</script>

<style>

</style>

<input type="text" bind:value={$value} {style} {disabled}/>