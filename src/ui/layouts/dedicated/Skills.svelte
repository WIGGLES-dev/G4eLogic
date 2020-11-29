<script lang="ts">
    import { getContext } from "svelte";
    import List from "@ui/lists/List.svelte";

    import SkillEntity from "@ui/entities/Skill.svelte";
    import SkillEditor from "@ui/editors/SkillEditor.svelte";

    import { Skill, Technique, Valor, FeatureType, Sheet } from "@internal";

    const sheet = getContext<Sheet>("sheet");
    const { skills$, techniques$ } = sheet;

    async function addSkill() {
        Valor.addEntities(FeatureType.Skill, [
            sheet.embed(new Skill(null).wrapData()),
        ]);
    }
    async function addTechnique() {
        Valor.addEntities(FeatureType.Technique, [
            sheet.embed(new Technique(null).wrapData()),
        ]);
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
