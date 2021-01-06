<script context="module" lang="ts">

</script>
<script lang="ts">
    import { TreeItem } from "./TreeGrid.svelte";
    import Attribute from "./TreeGridAttribute.svelte";
    import Observe, { isStore } from "@components/Observe.svelte";
    import ContextMenu from "@components/ContextMenu/ContextMenu.svelte";
    import { SvelteComponent, getContext, afterUpdate } from "svelte";
    export let toggle: string;
    export let groupBy: string[]
    export let widths: Record<string,string>;
    export let item: TreeItem;
    $: ({toggled, disabled} = item);
    export let index: number;
    export let depth = 0;
    export let itemClassList: string = '';
    export let attributeClassList: string = '';
    const children$ = item.children;
    let row;
    $: style = ``;
    afterUpdate(() => {
        index = Array.from(row?.parentElement?.children ?? []).findIndex(r => r === row);
    });
</script>

<style>
    .disabled {
        @apply bg-red-100;
    }
</style>

<li
    on:click={e => console.log(item)}
    bind:this={row}
    data-i={index}
    data-id={item.id}
    data-depth={depth}
    class:disabled={$disabled}
    class="{itemClassList} {item.classList}"
    {style}
>
    {#each groupBy as group, i (i)}
        <Attribute on:drag on:drop on:toggle on:contextmenu {attributeClassList} {depth} {index} {group} {toggle} {item} {widths} />
    {/each}
</li>
{#if $toggled && $children$ instanceof Array && $children$.length > 0}
    {#each $children$ as child, i (child.id)}
        <svelte:self
            on:drag
            on:drop
            on:toggle
            on:contextmenu 
            depth={depth+1}
            {toggle}
            item={child}
            {widths}
            {groupBy}
            {itemClassList}
            {attributeClassList}
        />
    {/each}
{/if}