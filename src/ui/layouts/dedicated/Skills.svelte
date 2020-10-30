<script>
    import { getContext } from "svelte";
    import List from "@ui/lists/List";

    import Skill from "@ui/entities/Skill";
    import SkillEditor from "@ui/editors/SkillEditor";

    import TechniqueEditor from "@ui/editors/TechniqueEditor";

    const { character, components } = getContext("editor");

    $: skillList = $character.skillList.rootItems();
    $: techniqueList = $character.techniqueList.rootItems();

    function addSkill() {
        $character.skillList.addListItem();
    }
    function addTechnique() {
        $character.techniqueList.addListItem();
    }
</script>

<style>
</style>

<List
    title="Techniques"
    on:additem={addTechnique}
    component={Skill}
    editor={TechniqueEditor}
    list={techniqueList}>
    <tr slot="header">
        <th>Ref</th>
        <th>Pts</th>
        <th>Rsl</th>
        <th>Mod</th>
        <th>Lvl</th>
        <th class="w-full">Techniques</th>
    </tr>
</List>
<List
    on:additem={addSkill}
    title="Skill"
    component={Skill}
    editor={SkillEditor}
    list={skillList}>
    <tr slot="header">
        <th>Ref</th>
        <th>Pts</th>
        <th>Rsl</th>
        <th>Mod</th>
        <th>Lvl</th>
        <th class="w-full">Skills</th>
    </tr>
</List>
