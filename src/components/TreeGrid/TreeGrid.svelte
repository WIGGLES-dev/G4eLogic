<script lang="ts" context="module">
    import { SvelteComponent } from "svelte";
    import { Observable } from "rxjs";
    import ContextMenu, { ContextMenuOption } from "@components/ContextMenu/ContextMenu.svelte";
    import { Component } from '@components/Cell.svelte';
    export type Label = string|number | Observable<string|number>
    export type ItemAttribute = Label | Component
    export interface ItemAttributes {
        [key: string]: ItemAttribute
    }
    export interface TreeItem {
        ctx?: any
        id?: string
        attributes: ItemAttributes
        context?: ContextMenuOption[]
        toggled?: Observable<boolean>
        showToggle?: Observable<boolean>
        weight?: Observable<number>
        classList?: string
        disabled?: Observable<boolean>
        children?: Observable<TreeItem[]>
    }
</script>
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import Item from "./TreeGridItem.svelte";
    export let items: TreeItem[] = [];
    export let headers: TreeItem[] = [];
    export let groupBy: string[] = Object.keys(items[0].attributes);
    export let widths: Record<string,string> = {};
    //export let unnestKey = 'children';
    export let toggle;
    export function addItem(e) {
        dispatch('additem');
    }
    let list: HTMLOListElement;
    async function sortList(e) {
        const currentList = Array.from(list.querySelectorAll('li')).slice(1).map(node => ({id: node.dataset.id}));
        const {
            from,
            to
        } = e.detail;
        const newList = [...currentList];
        newList.splice(to.index - 1, 0, newList.splice(from.index - 1, 1)[0]);
        dispatch('sortlist', {
            from,
            to,
            newList,
            currentList
        });
    }
    let contextMenu: ContextMenu;
    async function onContextMenu(e: CustomEvent) {
        const {mouseEvent, options} = e.detail;
        await contextMenu.update(mouseEvent);
        contextMenu.$set({
            options,
            rendered: true
        });
    }
</script>

<style>
    .tree-grid {
        @apply table;
    }
</style>

<section class="p-2">
    <ol bind:this={list} class="tree-grid">
        {#each headers as header, i (i)}
            <slot name='header' {header} {groupBy} {widths}>
                <Item 
                    item={header}
                    on:drag
                    on:drop
                    on:drop
                    on:toggle
                    on:contextmenu={onContextMenu}
                    {groupBy}
                    {widths}
                    itemClassList='table-row relative'
                    attributeClassList='table-cell px-1 border-b border-solid border-black'
                />
            </slot>
        {/each}
        {#each items as item, i (item.id)}
            <slot name='item' {item} {groupBy} {widths}>
                <Item 
                    on:drag
                    on:drop
                    on:drop={sortList}
                    on:toggle {item}
                    on:contextmenu={onContextMenu}
                    {toggle}
                    {groupBy}
                    {widths}
                    itemClassList='table-row even:bg-gray-100 relative'
                    attributeClassList='table-cell px-1 border-b border-solid border-black'
                />
            </slot>
        {/each}
    </ol>
    <div>
        <span class="fas fa-plus text-red-700" on:click={addItem} />
    </div>
</section>
<ContextMenu bind:this={contextMenu} />