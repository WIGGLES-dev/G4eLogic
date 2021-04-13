<script context="module" lang="ts">
    import EquipmentEditor from "./EquipmentEditor.svelte";
    import EquipmentModifierEditor from "./EquipmentModifierEditor.svelte";
    import MeleeWeaponEditor from "./MeleeWeaponEditor.svelte";
    import RangedWeaponEditor from "./RangedWeaponEditor.svelte";
    import SkillEditor from "./SkillEditor.svelte";
    import SpellEditor from "./SpellEditor.svelte";
    import TechniqueEditor from "./TechniqueEditor.svelte";
    import TraitEditor from "./TraitEditor.svelte";
    import TraitModifierEditor from "./TraitModifierEditor.svelte";
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
        "trait modifier": TraitModifierEditor,
        "equipment modifier": EquipmentModifierEditor,
    };
    interface EditorContext<T extends Entity<Data, Data>> {
        SystemWorker$: GURPSWorker;
        SystemClasses: GURPSWorker["classes"];
        record$: Observable<VerifiedState<T["record"]>>;
        rootId$: Observable<string>;
        entity$: Observable<VerifiedState<T["record"]>>;
        processed$: Observable<ReturnType<T["process"]>>;
        worker: Observable<Remote<T>>;
        state: State<T["record"]>;
        getWorker<T>(): Observable<Remote<T>>;
    }
    export const editorctx = Symbol("editor");
    export function getEditorContext<
        T extends Entity<Data, Data> = Entity<Data, Data>
    >() {
        return getContext<EditorContext<T>>(editorctx);
    }
</script>

<script lang="ts">
    import { setContext, getContext, onDestroy, onMount } from "svelte";
    import { fetchRecord, validateResource, System } from "@internal";
    import {
        BehaviorSubject,
        fromEvent,
        defer,
        EMPTY,
        from,
        Observable,
        using,
        Subject,
        combineLatest,
    } from "rxjs";
    import {
        debounceTime,
        filter,
        map,
        mergeAll,
        mergeMap,
        multicast,
        pluck,
        publish,
        publishBehavior,
        refCount,
        share,
        skip,
        switchAll,
        switchMap,
        tap,
        withLatestFrom,
    } from "rxjs/operators";
    import { State, VerifiedState } from "rxdeep";
    import type { Remote } from "comlink";
    import type { Data, GURPSWorker, Entity } from "@internal";
    import { root } from "postcss";
    export let params;
    $: ({ type, id, embed } = params);
    const record$ = from(fetchRecord<Data>("index", params.id)).pipe(
        map((state) => state.verified(validateResource))
    );
    const root$ = record$.pipe(switchAll());
    const rootId$ = root$.pipe(pluck("id"));
    const params$ = new BehaviorSubject(params);
    $: params$.next(params);
    const entity$ = combineLatest([record$, params$]).pipe(
        switchMap(([state, { id, type, embed }]) =>
            embed
                ? state
                      .deepSub<Data>((obj) => obj && obj.id === embed)
                      .pipe(map((state) => state.verified(validateResource)))
                : from([state])
        )
    );
    const SystemWorker = System.getWorker("gurps") as GURPSWorker;
    const value$ = entity$.pipe(switchAll());
    const processed$ = value$.pipe(
        withLatestFrom(root$),
        debounceTime(250),
        tap(() => console.time("processing")),
        mergeMap(([v, root]) => SystemWorker.process(root, v)),
        tap(() => console.timeEnd("processing")),
        publishBehavior({} as Record<string, any>),
        refCount()
    );
    const exists$ = value$.pipe(
        map((value) => value && value.id && value.id === (embed ? embed : id))
    );
    export const context = {
        SystemWorker,
        record$,
        rootId$,
        entity$,
        value$,
        processed$,
        get state() {
            return $entity$;
        },
    };
    setContext(editorctx, context);
</script>

{#if $exists$ && $processed$}
    <svelte:component this={editors[type]} entity={$entity$} />
{:else if $exists$ === false}
    <div class="bg-blue-600 h-screen w-screen">
        <h1 class="text-9xl text-center text-white">Record Not Found</h1>
    </div>
{/if}
