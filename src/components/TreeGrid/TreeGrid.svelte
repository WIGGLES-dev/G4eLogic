<script lang="ts" context="module">
    import { SvelteComponent } from "svelte";
    import { Observable } from "rxjs";
    import { ContextMenuOption } from "@components/ContextMenu/ContextMenu.svelte";
    export interface Widget {
        component: typeof SvelteComponent;
        props?: Record<string, any>;
    }
    export type Label = string|number | Observable<string|number>
    export type ItemAttribute = Label | (Widget | {label: Label}) & {context?: ContextMenuOption[]};
    export interface ItemAttributes {
        [key: string]: ItemAttribute
    }
    export interface TreeItem {
        id?: string
        attributes: ItemAttributes
        context?: ContextMenuOption[]
        toggled?: boolean
        showToggle?: boolean
        weight?: number
        classList?: string
        children?: Observable<TreeItem[]>
    }
</script>
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import Item from "./TreeGridItem.svelte";
    export let items: TreeItem[] = [];
    export let groupBy: string[] = Object.keys(items[0].attributes);
    export let widths: Record<string,string> = {};
    export let unnestKey = 'children';
    export let toggle;
    export function addItem(e) {
        dispatch('additem');
    }
    let list: HTMLOListElement;
    function sortList(e) {
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
</script>

<style>
    .tree-grid {
        @apply table;
    }
</style>

<section class="p-2">
    <ol bind:this={list} class="tree-grid">
        {#each items as item, i (item.id)}
            <Item on:drag on:drop on:drop={sortList} on:toggle {item} {toggle} {groupBy} {widths} />
        {/each}
    </ol>
    <div>
        <span class="fas fa-plus text-red-700" on:click={addItem} />
    </div>
</section>