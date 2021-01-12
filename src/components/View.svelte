<script context='module' lang='ts'>
    import { CellValue } from '@components/Cell.svelte';
    export interface Composite {
        above: Composite | CellValue
        left: Composite | CellValue
        main: Composite | CellValue
        right: Composite | CellValue
        below: Composite | CellValue
    }
</script>
<script lang='ts'>
    import Cell from '@components/Cell.svelte';
    export let compose: Composite[];
    export let above;
    export let left;
    export let main;
    export let right;
    export let below;
</script>

<style>

</style>

{#if compose}
    {#each compose as composite}
        {#if composite instanceof Array}
            <svelte:self compose={composite}></svelte:self>
        {:else}
            <svelte:self {...composite}></svelte:self>
        {/if}
    {/each}
{:else}
    <slot name='above'>
        <Cell value={above} {...above} /> 
    </slot>
    <div class="flex flex-wrap">
        <slot name="left">
            <Cell value={left} {...left} /> 
        </slot>
        <slot>
            <Cell value={main} {...main}/>
        </slot>
        <slot name="right">
            <Cell value={right} {...right} />
        </slot>
    </div>
    <slot name="below">
        <Cell value={below} {...below} />
    </slot>
{/if}