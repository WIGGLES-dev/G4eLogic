<script context="module" lang="ts">
    export interface SelectOption {
        label: string
        value: any
    }
</script>
<script lang="ts">
    import { isStore } from '@components/Observe.svelte';
    import Option from "./Option.svelte";
    export let value;
    export let options: (SelectOption |string)[];
</script>

<style>

</style>

{#if isStore(value)}
    <select bind:value={$value}>
        {#each options as option, i (i)}
            <Option {option}/>
        {/each}
    </select>
{:else}
    <select {value}>
        {#each options as option, i (i)}
            <Option {option}/>
        {/each}
    </select>
{/if}
