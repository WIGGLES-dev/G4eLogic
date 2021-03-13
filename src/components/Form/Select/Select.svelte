<script context="module" lang="ts">
    export interface SelectOption {
        label: string
        value: any
    }
</script>
<script lang="ts">
    import { Observable, from } from 'rxjs';
    import Option from "./Option.svelte";
    export let value;
    export let multiple: boolean
    export let options: Observable<(SelectOption |string)[]> = from([[]]);
</script>

<style>

</style>

{#if multiple}
    <label>
        <select multiple bind:value={$value}>
            {#each $options as option, i (i)}
                <Option {option}/>
            {/each}
        </select>
    </label>
{:else}
    <label>
        <select bind:value={$value}>
            {#each $options as option, i (i)}
                <Option {option} />
            {/each}
        </select>
    </label>
{/if}

{#if false}
    <div>
        
    </div>
{/if}