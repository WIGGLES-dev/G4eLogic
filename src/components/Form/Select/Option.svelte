<script lang="ts">
    import Observe, {SelectOption} from "./Select.svelte";
    import Cell from "@components/Cell.svelte";
    import { isStore } from "@components/Observe.svelte";
    export let option: string | SelectOption;
    let value = typeof option === 'object' && option.value || option;
    let label = typeof option === 'object' && option.label || option;
</script>

{#if typeof option === 'string'}
    <option value={option}>
        {option}
    </option>
{:else if isStore(value)}
    <Observe observable={value} let:value>
        <option {value}>
            <Cell value={label || value}/>
        </option>
    </Observe>
{:else}
    <option value={value}>
        <Cell value={label||value} />
    </option>
{/if}