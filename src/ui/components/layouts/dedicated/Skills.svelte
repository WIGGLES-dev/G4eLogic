<script>
    import { getContext } from "svelte";
    import List from "@ui/components/lists/List";

    import Skill from "@ui/components/entities/Skill";
    import SkillEditor from "@ui/components/editors/SkillEditor";

    const { character, components } = getContext("app");

    $: skillList = $character.skillList;
    $: techniqueList = $character.techniqueList;

    function addSkill() {
        skillList.addListItem();
    }
    function addTechnique() {
        techniqueList.addListItem();
    }
</script>

<style>
</style>

<List
    title="Techniques"
    on:additem={addTechnique}
    component={Skill}
    list={techniqueList.contents.arr}>
    <tr slot="header">
        <th class="w-full">Techniques</th>
        <th>SL</th>
        <th>RSL</th>
        <th>Pts</th>
        <th>Mod</th>
        <th>Ref</th>
    </tr>
</List>
<List
    on:additem={addSkill}
    title="Skill"
    component={Skill}
    editor={SkillEditor}
    list={skillList.contents.arr}>
    <tr slot="header">
        <th class="w-full">Skills</th>
        <th>SL</th>
        <th>RSL</th>
        <th>Pts</th>
        <th>Mod</th>
        <th>Ref</th>
    </tr>
</List>
