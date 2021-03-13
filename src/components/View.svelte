<script context="module" lang="ts">
    import Value from "@components/Value.svelte";
    export interface Composite {
        above;
        left;
        main;
        right;
        below;
    }
</script>

<script lang="ts">
    export let compose: Composite[];
    export let above;
    export let left;
    export let main;
    export let right;
    export let below;
</script>

{#if compose}
    {#each compose as composite}
        {#if composite instanceof Array}
            <svelte:self compose={composite} />
        {:else}
            <svelte:self {...composite}>
                <slot name="left" />
                <slot />
                <slot name="right" />
                <slot name="below" />
            </svelte:self>
        {/if}
    {/each}
{:else}
    <slot name="above">
        <Value value={above} {...above} />
    </slot>
    <div class="flex flex-wrap">
        <slot name="left">
            <Value value={left} {...left} />
        </slot>
        <slot>
            <Value value={main} {...main} />
        </slot>
        <slot name="right">
            <Value value={right} {...right} />
        </slot>
    </div>
    <slot name="below">
        <Value value={below} {...below} />
    </slot>
{/if}

<style>
</style>
