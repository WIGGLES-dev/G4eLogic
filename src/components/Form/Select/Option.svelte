<script lang="ts">
    import Observe, { SelectOption } from "./Select.svelte";
    import Cell from "@components/Value.svelte";
    export let option: string | SelectOption;
    let value = (typeof option === "object" && option.value) || option;
    let label = (typeof option === "object" && option.label) || option;
</script>

{#if typeof option === "string"}
    <option value={option}>
        {option}
    </option>
{:else}
    <option {value}>
        <Cell value={label || value} />
    </option>
{/if}
