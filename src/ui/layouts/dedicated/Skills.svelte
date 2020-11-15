<script>
    import { getContext } from "svelte";
    import List from "@ui/lists/List";

    import SkillEntity from "@ui/entities/Skill";
    import SkillEditor from "@ui/editors/SkillEditor";

    import { Skill, Technique } from "@internal";
    import { writable } from "svelte/store";
    import { listen } from "svelte/internal";

    const { character, editor } = getContext("editor");
    const { skills$, techniques$ } = character;

    function addSkill() {
        new Skill().mount(character.id);
    }
    function addTechnique() {
        new Technique().mount(character.id);
    }
    function getRoot(entities) {
        return entities
            .filter((entity) => entity.owner == null)
            .sort((a, b) => a.listWeight - b.listWeight);
    }
    function accessChildren(entity) {
        return entity.sameChildren.sort((a, b) => a.listWeight - b.listWeight);
    }
    $: techniqueProps = {
        draggable: true,
        addItem: true,
        component: SkillEntity,
        list: $techniques$,
        getRoot,
        accessChildren,
    };
    $: skillProps = {
        ...techniqueProps,
        list: $skills$,
    };
</script>

<style>
</style>

<List on:additem={addTechnique} {...techniqueProps}>
    <tr slot="header">
        <th>Ref</th>
        <th>Pts</th>
        <th>Rsl</th>
        <th>Mod</th>
        <th>Lvl</th>
        <th class="w-full">Techniques</th>
    </tr>
</List>
<List on:additem={addSkill} {...skillProps}>
    <tr slot="header">
        <th>Ref</th>
        <th>Pts</th>
        <th>Rsl</th>
        <th>Mod</th>
        <th>Lvl</th>
        <th class="w-full">Skills</th>
    </tr>
</List>
