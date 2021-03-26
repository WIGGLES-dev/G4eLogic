<script context="module" lang="ts">
    import EquipmentEditor from "./EquipmentEditor.svelte";
    import MeleeWeaponEditor from "./MeleeWeaponEditor.svelte";
    import RangedWeaponEditor from "./RangedWeaponEditor.svelte";
    import SkillEditor from "./SkillEditor.svelte";
    import SpellEditor from "./SpellEditor.svelte";
    import TechniqueEditor from "./TechniqueEditor.svelte";
    import TraitEditor from "./TraitEditor.svelte";
    import CharacterEditor from "./CharacterEditor.svelte";
    export const editors = {
        equipment: EquipmentEditor,
        "melee weapon": MeleeWeaponEditor,
        "ranged weapon": RangedWeaponEditor,
        skill: SkillEditor,
        spell: SpellEditor,
        technique: TechniqueEditor,
        trait: TraitEditor,
        character: CharacterEditor,
    };
</script>

<script lang="ts">
    import { fetchRecord, validateResource, System } from "@internal";
    import { from } from "rxjs";
    import {
        map,
        mergeAll,
        mergeMap,
        startWith,
        switchAll,
        tap,
    } from "rxjs/operators";
    import { setContext } from "svelte";
    import { withComlinkProxy } from "@utils/operators";
    import { Remote } from "comlink";
    export let params;
    export let id = params.id;
    export let type = params.type;
    export let embed = params.embed;
    const record = from(fetchRecord<any>("index", params.id));
    const rootState$ = record;
    const state$ = record.pipe(
        mergeMap((state) =>
            embed
                ? state.deepSub((obj) => obj && obj.id === embed)
                : from([state])
        ),
        map((state) => state.verified(validateResource))
    );
    const exists$ = state$.pipe(
        mergeAll(),
        map((value) => value?.id === (embed ? embed : id))
    );
    const Worker = System.getWorker<Remote<typeof Object>>(type);
    const worker = state$.pipe(
        mergeAll(),
        withComlinkProxy((c) => new Worker(c))
    );
    setContext("worker", worker);
    setContext("rootState", $rootState$);
    setContext("state", $state$);
</script>

{#if $exists$}
    {#key type}
        <svelte:component this={editors[type]} entity={$state$} />
    {/key}
{:else if $exists$ === false}
    <div class="bg-blue-600 h-screen w-screen">
        <h1 class="text-9xl text-center text-white bg-blue-600">
            Record Not Found
        </h1>
    </div>
{/if}