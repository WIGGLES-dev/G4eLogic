<script lang="ts">
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

    import {
        Resource,
        Collection,
        Sheet,
        Valor,
        GurpsResources,
    } from "@internal";

    export let id: string;
    export let type: string;

    $: entity = Collection.types.get(type).instance(id);
    $: sheet = entity.getNearest("sheet", Sheet);

    function editorType(type) {
        switch (type) {
            case GurpsResources.Equipment:
                return EquipmentEditor;
            case GurpsResources.Skill:
                return SkillEditor;
            case GurpsResources.Spell:
                return SpellEditor;
            case GurpsResources.Technique:
                return TechniqueEditor;
            case GurpsResources.Trait:
                return TraitEditor;
            case GurpsResources.MeleeWeapon:
                return MeleeWeaponEditor;
            case GurpsResources.RangedWeapon:
                return RangedWeaponEditor;
        }
    }
</script>

<style>
    div {
        min-height: 20rem;
    }
</style>

<div class="m-2">
    {#if sheet}
        <button
            on:click={(e) => sheet.edit()}
            class="w-full bg-gray-700 text-white rounded">Back To Sheet</button>
    {/if}

    <svelte:component this={editorType(type)} {entity} />
</div>
