<script>
    import { Skill, Technique } from "@sheet/gurpsFeatures/index";
    import { getContext } from "svelte";
    import List from "@ui/lists/List";

    import SkillEntity from "@ui/entities/Skill";
    import SkillEditor from "@ui/editors/SkillEditor";

    import TechniqueEditor from "@ui/editors/TechniqueEditor";

    const { character, components } = getContext("editor");
    const { skills$, techniques$ } = character;

    function addSkill() {
        new Skill().mount(character.id);
    }
    function addTechnique() {
        new Technqique().mount(character.id);
    }
</script>

<style>
</style>

<List
    title="Techniques"
    on:additem={addTechnique}
    component={SkillEntity}
    editor={TechniqueEditor}
    list={$techniques$}>
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
    component={SkillEntity}
    editor={SkillEditor}
    list={$skills$}>
    <tr slot="header">
        <th>Ref</th>
        <th>Pts</th>
        <th>Rsl</th>
        <th>Mod</th>
        <th>Lvl</th>
        <th class="w-full">Skills</th>
    </tr>
</List>
