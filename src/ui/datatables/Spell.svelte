<script context="module" lang="ts">
</script>

<script lang="ts">
    import { getContext } from "svelte";
    import { State } from "rxdeep";
    import DataTable from "@ui/DataTable.svelte";
    import { CharacterData } from "@internal";
    import SkillRow from "./rows/Skill.svelte";
    export let character: State<CharacterData>;
</script>

<DataTable
    type="spell"
    root={character}
    component={SkillRow}
    nestedStructure={true}
>
    <tr slot="thead">
        <th class="w-full">Spell</th>
        <th>Signature</th>
        <th>Difficulty</th>
        <th>Points</th>
        <th>Mod</th>
        <th>RSL</th>
        <th>Level</th>
        <th>Resist</th>
        <th>Spell Class</th>
        <th> Casting Cost </th>
        <th>Maintenance Cost</th>
        <th>Casting Time</th>
        <th> Duration </th>
        <th>Reference</th>
    </tr>
</DataTable>

<style>
</style>
