<script lang="ts">
    export let value: any;
    export let width = '3rem';
    export let disabled: boolean
    $: style = `
        flex: 1;
        width: ${width};
    `;
</script>
<style>

</style>

<input type="number" bind:value={$value} {disabled} {style} />