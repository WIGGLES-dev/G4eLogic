<script context='module' lang='ts'>
    import EquipmentEditor from './EquipmentEditor.svelte';
    import MeleeWeaponEditor from './MeleeWeaponEditor.svelte';
    import RangedWeaponEditor from './RangedWeaponEditor.svelte';
    import SkillEditor from './SkillEditor.svelte';
    import SpellEditor from './SpellEditor.svelte';
    import TechniqueEditor from './TechniqueEditor.svelte';
    import TraitEditor from './TraitEditor.svelte';
    import CharacterEditor from './CharacterEditor.svelte';
    import { 
        Equipment,
        MeleeWeapon,
        RangedWeapon,
        Skill,
        Spell,
        Technique,
        Trait,
        Character
    } from '@internal';
    export const editors = {
        [Equipment.type]: EquipmentEditor,
        [MeleeWeapon.type]: MeleeWeaponEditor,
        [RangedWeapon.type]: RangedWeaponEditor,
        [Skill.type]: SkillEditor,
        [Spell.type]: SpellEditor,
        [Technique.type]: TechniqueEditor,
        [Trait.type]: TraitEditor,
        [Character.type]: CharacterEditor
    };
</script>
<script lang='ts'>
    export let params;
    $: console.log(params);
</script>

<svelte:component this={editors[params.type]} id={params.id} type={params.type} />