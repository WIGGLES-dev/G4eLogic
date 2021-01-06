<script context="module" lang="ts">

</script>
<script lang="ts">
    import {TreeItem} from "./TreeGrid.svelte";
    import Cell from "@components/Cell.svelte";
    import Toggle from "@components/Toggle.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let depth: number;
    export let index: number;
    export let toggle: string;
    export let widths: Record<string,string>
    export let item: TreeItem;
    const {
        showToggle,
        toggled
    } = item;
    export let group: string;
    export let attributeClassList: string = ''
    $: attribute = item.attributes[group];
    async function onContextMenu(mouseEvent: MouseEvent) {
        dispatch(
            'contextmenu',
            {
                options: (item.attributes[group] || {})['context'] || item.context,
                mouseEvent
            }
        );
    }
    function onDrop(e: DragEvent) {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        dispatch('drop', {
            from: data,
            to: {
                id: item.id,
                depth,
                index
            }
        });
    }
    function onDrag(e: DragEvent) {
        const rowInfo = {
                id: item.id,
                depth,
                index
            }
        e.dataTransfer.setData('application/json', JSON.stringify(rowInfo))
        dispatch('drag', rowInfo
        );
    }
    function onDragOver(e: DragEvent) {
        e.preventDefault();
    }
    function onToggle({detail}) {
        dispatch('toggle', {
                id: item.id,
                depth,
                index,
                toggled: detail
            }
        );
    }
</script>

<style>

</style>

<div 
    on:drop={onDrop}
    on:dragstart={onDrag}
    on:dragover={onDragOver}
    on:contextmenu|preventDefault={onContextMenu}
    draggable="true"
    class='{attributeClassList}'
    style="width: {widths[group]}"
>
    <div class="flex items-baseline">
        {#if toggle === group}
            <span style="padding-left: {depth*30}px;"></span>
        {/if}
        <Toggle class='px-1 text-red-700' on:toggle={onToggle} visible={toggle === group && $showToggle} toggled={$toggled} />
        <slot name='cell' value={attribute} {item} {group}>
            <Cell value={attribute} />
        </slot>
    </div>
</div>