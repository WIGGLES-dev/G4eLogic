<script context="module" lang="ts">
</script>

<script lang="ts">
    import { getContext } from "svelte";
    import { State } from "rxdeep";
    import DataTable from "@ui/DataTable.svelte";
    import EquipmentRow from "./rows/Equipment.svelte";
    import type { Character, CharacterData } from "@internal";
    export let character: State<CharacterData>;
    $: filter = {
        type: "equipment",
    };
</script>

{#if true}
    <data-table
        type="equipment"
        idpath={["id"]}
        data={$character}
        branchpath={["children"]}
        {filter}
        on:cellchange={({ detail: { id, path, value } }) => {
            character.sub(...path).set(value);
        }}
    >
        <tr slot="thead">
            <th>E</th>
            <th class="px-2">#</th>
            <th>Equipment</th>
            <th>Uses</th>
            <th>Value</th>
            <th>Weight</th>
            <th>EValue</th>
            <th>EWeight</th>
            <th>Reference</th>
        </tr>
    </data-table>
{/if}

<DataTable
    main={2}
    type="equipment"
    root={character}
    component={EquipmentRow}
    nestedStructure={true}
>
    <tr slot="thead">
        <th>E</th>
        <th class="px-2">#</th>
        <th>Equipment</th>
        <th>Uses</th>
        <th>Value</th>
        <th>Weight</th>
        <th>EValue</th>
        <th>EWeight</th>
        <th>Reference</th>
    </tr>
</DataTable>

<style lang="postcss">
</style>
