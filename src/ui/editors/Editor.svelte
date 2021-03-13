<script context="module" lang="ts">
    import EquipmentEditor from "./EquipmentEditor.svelte";
    import MeleeWeaponEditor from "./MeleeWeaponEditor.svelte";
    import RangedWeaponEditor from "./RangedWeaponEditor.svelte";
    import SkillEditor from "./SkillEditor.svelte";
    import SpellEditor from "./SpellEditor.svelte";
    import TechniqueEditor from "./TechniqueEditor.svelte";
    import TraitEditor from "./TraitEditor.svelte";
    import CharacterEditor from "./CharacterEditor.svelte";
    import Form from "@components/Form/Form.svelte";
    import {
        Equipment,
        MeleeWeapon,
        RangedWeapon,
        Skill,
        Spell,
        Technique,
        Trait,
        Character,
        Resource,
        System,
    } from "@internal";
    export const editors = {
        [Equipment.type]: EquipmentEditor,
        [MeleeWeapon.type]: MeleeWeaponEditor,
        [RangedWeapon.type]: RangedWeaponEditor,
        [Skill.type]: SkillEditor,
        [Spell.type]: SpellEditor,
        [Technique.type]: TechniqueEditor,
        [Trait.type]: TraitEditor,
        [Character.type]: CharacterEditor,
    };
</script>

<script lang="ts">
    export let params;
    $: ({ id, type, embed } = params);
    $: root = new Resource(id);
    $: target = embed ? root.selectEmbedded(embed) : root;
    $: entity = target instanceof Resource ? target : $target;
    $: valid = entity.id === (embed || id);
</script>

{#key entity.id}
    {#if valid}
        <svelte:component this={editors[entity.type]} {entity} />
    {/if}
{/key}
