<script context="module" lang="ts">
  interface EditorContext<T extends Entity<Data, Data>> {
    SystemWorker$: GURPSWorker;
    SystemClasses: GURPSWorker["classes"];
    record$: Observable<VerifiedState<T["record"]>>;
    rootId$: Observable<string>;
    entity$: Observable<VerifiedState<T["embed"]>>;
    value$: Observable<T["embed"]>;
    id$: Observable<string>;
    processed$: Observable<ReturnType<T["process"]>>;
    worker: Observable<Remote<T>>;
    state: State<T["record"]>;
    getWorker<T>(): Observable<Remote<T>>;
    getEditor(type: string): Promise<any>;
    System: AbstractSystem;
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
  import { AbstractSystem, fetchRecord } from "@internal";
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
  import { capitalize } from "@app/utils/strings";
  import { systemctx } from "@app/main.svelte";
  export let params;
  $: ({ type, id, embed } = params);
  const System = getContext<AbstractSystem>(systemctx);
  const record$ = from(fetchRecord<Data>("index", params.id)).pipe(
    map((state) => state.verified(System.stateVerifier())),
    share()
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
            .pipe(map((state) => state.verified(System.stateVerifier())))
        : from([state])
    )
  );
  const SystemWorker = System.getWorker("gurps") as GURPSWorker;
  const value$ = entity$.pipe(switchAll());
  const id$ = value$.pipe(pluck("id"));
  const processed$ = value$.pipe(
    withLatestFrom(root$),
    debounceTime(1000),
    tap(() => console.time("processing")),
    mergeMap(([v, root]) => {
      return SystemWorker.process(root, v);
    }),
    tap(() => console.timeEnd("processing")),
    publishBehavior(null),
    refCount()
  );
  const exists$ = value$.pipe(
    map((value) => value && value.id && value.id === (embed ? embed : id))
  );
  async function getEditor(type: string) {
    const fn = type.split(" ").map(capitalize).join("");
    return (await import(`./editors/${fn}Editor.svelte`))?.default;
  }
  export const context = {
    System,
    SystemWorker,
    record$,
    rootId$,
    entity$,
    value$,
    id$,
    processed$,
    get state() {
      return $entity$;
    },
    getEditor,
  };
  setContext(editorctx, context);
</script>

{#if $exists$ && $processed$}
  {#await getEditor(type)}
    <!--  -->
  {:then component}
    <svelte:component this="{component}" entity="{$entity$}" />
  {/await}
{:else if $exists$ === false}
  <div class="bg-blue-600 h-screen w-screen">
    <h1 class="text-9xl text-center text-white">Record Not Found</h1>
  </div>
{/if}
