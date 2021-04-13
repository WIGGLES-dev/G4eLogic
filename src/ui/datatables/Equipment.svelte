<script context="module" lang="ts">
</script>

<script lang="ts">
    import { getContext } from "svelte";
    import { State } from "rxdeep";
    import DataTable from "@ui/DataTable.svelte";
    import EquipmentRow from "./rows/Equipment.svelte";
    import type { Character, CharacterData } from "@internal";
    export let character: State<CharacterData>;
</script>

<DataTable type="equipment" root={character} component={EquipmentRow} nestedStructure={true}>
    <tr slot="thead">
        <th>E</th>
        <th>
            <span class="px-2">#</span>
        </th>
        <th class="w-full">
            Equipment
            <!-- <select disabled bind:value={$filter$}>
                <option value="carried">Carried</option>
                <option value="other">Other</option>
            </select> -->
        </th>
        <th>Uses</th>
        <th>Value</th>
        <th>Weight</th>
        <th>EValue</th>
        <th>EWeight</th>
        <!-- <th>Location</th> -->
        <th>Reference</th>
    </tr>
</DataTable>

<style lang="postcss">
</style>
