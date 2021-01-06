<script context="module" lang="ts">
    export interface SelectOption {
        label: string
        value: any
    }
</script>
<script lang="ts">
    import { isStore } from '@components/Observe.svelte';
    import { Observable } from 'rxjs';
    import Option from "./Option.svelte";
    export let value;
    export let multiple: boolean
    export let options: Observable<(SelectOption |string)[]>;
</script>

<style>

</style>

{#if multiple}
    <select multiple bind:value={$value}>
        {#each $options as option, i (i)}
            <Option {option}/>
        {/each}
    </select>
{:else}
    <select bind:value={$value}>
        {#each $options as option, i (i)}
            <Option {option} />
        {/each}
    </select>
{/if}