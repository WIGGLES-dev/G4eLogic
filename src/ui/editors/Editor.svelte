<script>
    import { setContext } from "svelte";

    import EquipmentEditor from "@ui/editors/EquipmentEditor.svelte";
    import EquipmentModifierEditor from "@ui/editors/EquipmentModifierEditor.svelte";
    import MeleeWeaponEditor from "@ui/editors/MeleeWeaponEditor.svelte";
    import RangedWeaponEditor from "@ui/editors/RangedWeaponEditor.svelte";
    import SkillEditor from "@ui/editors/SkillEditor.svelte";
    import SpellEditor from "@ui/editors/SpellEditor.svelte";
    import TechniqueEditor from "@ui/editors/TechniqueEditor.svelte";
    import TraitEditor from "@ui/editors/TraitEditor.svelte";
    import TraitModifierEditor from "@ui/editors/TraitModifierEditor.svelte";

    import Modal from "@ui/Modal.svelte";

    import { FeatureType } from "@internal";

    export let entity;

    function editorType(type) {
        switch (type) {
            case FeatureType.Equipment:
                return EquipmentEditor;
            case FeatureType.Skill:
                return SkillEditor;
            case FeatureType.Spell:
                return SpellEditor;
            case FeatureType.Technique:
                return TechniqueEditor;
            case FeatureType.Trait:
                return TraitEditor;
            case FeatureType.MeleeWeapon:
                return MeleeWeaponEditor;
            case FeatureType.RangedWeapon:
                return RangedWeaponEditor;
        }
    }
</script>

<style>
</style>

<svelte:component this={editorType(entity.type)} {entity} />
