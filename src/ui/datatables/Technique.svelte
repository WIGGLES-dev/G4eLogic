<script context="module" lang="ts">
</script>

<script lang="ts">
    import { getContext } from "svelte";
    import { State } from "rxdeep";
    import type { CharacterData } from "@internal";
    import ResourceTable from "@ui/DataTable.svelte";
    import SkillRow from "./rows/Skill.svelte";
    export let character: State<CharacterData>;
</script>

<ResourceTable type="technique" root={character} component={SkillRow} nestedStructure={true}>
    <tr slot="thead">
        <th>Technique</th>
        <th>Difficulty</th>
        <th>Points</th>
        <th>Mod</th>
        <!-- <th>RSL</th> -->
        <th>Level</th>
        <th>Reference</th>
    </tr>
</ResourceTable>
