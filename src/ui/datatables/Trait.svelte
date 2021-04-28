<script context="module" lang="ts">
</script>

<script lang="ts">
    import DataTable from "@ui/DataTable.svelte";
    import TraitRow from "./rows/Trait.svelte";
    import { State } from "rxdeep";
    import type { CharacterData } from "@internal";
    export let character: State<CharacterData>;
</script>

<DataTable
    type="trait"
    root={character}
    component={TraitRow}
    nestedStructure={true}
>
    <tr slot="thead">
        <th>
            <slot />
        </th>
        <th>Level</th>
        <th>Pts</th>
        <th>Reference</th>
    </tr>
</DataTable>

<style lang="postcss">
</style>
