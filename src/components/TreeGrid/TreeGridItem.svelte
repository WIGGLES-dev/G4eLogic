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
    export let index: number;
    export let depth = 0;
    const {
        children,
        attributes,
        context,
        classList = ""} = item;
    let row;
    afterUpdate(() => {
        index = Array.from(row?.parentElement.children ?? []).findIndex(r => r === row);
    });
</script>

<style>

</style>

<li
    on:click={e => console.log(item)}
    bind:this={row}
    data-i={index}
    data-id={item.id}
    class="table-row even:bg-gray-100 {classList}"
>
    {#each groupBy as group, i (i)}
        <Attribute on:drag on:drop on:toggle {depth} {index} {group} {toggle} {item} {widths} />
    {/each}
</li>
{#if $children instanceof Array && $children.length > 0}
    {#each $children as child, i (child.id)}
        <svelte:self
            on:drag
            on:drop
            on:toggle 
            depth={depth+1}
            toggle={i === 0 ? null : toggle}
            item={child}
            {widths}
            {groupBy}
        />
    {/each}
{/if}