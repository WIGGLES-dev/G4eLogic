<script context="module" lang="ts">
</script>

<script lang="ts">
    import { getContext } from "svelte";
    import { State } from "rxdeep";
    import DataTable from "@ui/DataTable.svelte";
    import SkillRow from "./rows/Skill.svelte";
    import type { CharacterData, Character } from "@internal";
    export let character: State<CharacterData>;
</script>

<DataTable
    type="skill"
    root={character}
    component={SkillRow}
    nestedStructure={true}
>
    <tr slot="thead">
        <th>Skill</th>
        <th>Specialization</th>
        <th>Signature</th>
        <th>Difficulty</th>
        <th>Points</th>
        <th>Mod</th>
        <th>RSL</th>
        <th>Level</th>
        <th>Reference</th>
    </tr>
</DataTable>

<style>
</style>
