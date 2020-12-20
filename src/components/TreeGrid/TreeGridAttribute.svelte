<script context="module" lang="ts">

</script>
<script lang="ts">
    import {TreeItem} from "./TreeGrid.svelte";
    import Cell from "@components/Cell.svelte";
    import Toggle from "@components/Toggle.svelte";
    import ContextMenu from "@components/ContextMenu/ContextMenu.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let depth: number;
    export let index: number;
    export let toggle: string;
    export let widths: Record<string,string>
    export let item: TreeItem;
    export let group: string;
    let contextMenu: ContextMenu; 
    async function launchContextMenu(e: MouseEvent) {
        await contextMenu.update(e);
        contextMenu.$set({
            rendered: true
        });
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
    function onToggle(e: CustomEvent) {
        dispatch('toggle', {
                id: item.id,
                depth,
                index
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
    on:contextmenu|preventDefault={launchContextMenu}
    draggable="true"
    class="table-cell px-2 py-1 border-b border-solid border-black" 
    style="width: {widths[group]}"
>
    {#if group instanceof Array}
        {#each group as subGroup}
            <svelte:self {depth} {toggle} group={subGroup} {item} {widths} />
        {/each}
    {:else}
            <div class="flex items-baseline">
                {#if toggle === group}
                    <span style="padding-left: {depth*30}px;"></span>
                {/if}
                <Toggle on:toggle={onToggle} visible={toggle === group && item.showToggle} on={item.toggled} />
                <Cell value={item.attributes[group]} />
            </div>
        <ContextMenu options={(item.attributes[group] || {})['context'] || item.context} bind:this={contextMenu} />
    {/if}
</div>