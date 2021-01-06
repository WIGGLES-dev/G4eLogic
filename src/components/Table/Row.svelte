<script lang='ts'>
    import { afterUpdate } from 'svelte';
    export let element: HTMLTableRowElement
    export let rowIndex: number
    let classList: string
    export {classList as class}
    function setIndex() {
        rowIndex = element.rowIndex;
    }
    afterUpdate(setIndex);
</script>

<style>

</style>

<tr bind:this={element} on:contextmenu class='{classList}'>
    <slot>
           
    </slot>
</tr>