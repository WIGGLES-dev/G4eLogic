<svelte:options accessors={true} />

<script context="module" lang="ts">
    import { v4 } from "uuid";
    import { State } from "rxdeep";
    import { fromEvent, Subscription, Observable } from "rxjs";
    import { tap, filter, distinctUntilChanged } from "rxjs/operators";
    import {
        onMount,
        beforeUpdate,
        afterUpdate,
        onDestroy,
        setContext,
        getContext,
        SvelteComponent,
        tick,
    } from "svelte";
    import { get_current_component } from "svelte/internal";
    import { arrayMove } from "@utils/array";
    export const TreeSymbol = Symbol("Tree");
    export const defaults = {
        tagfunc(item) {
            return Object.assign(item, { id: v4() });
        },
        keyfunc(item) {
            return item?.id;
        },
        filterfunc(item) {
            return true;
        },
        branchfunc(state: State<any>): State<any[]> {
            return state?.sub("children");
        },
        resolvefunc(item, i, children: State<any[]>) {
            return children?.sub(i);
        },
        verifyfunc(value) {
            return value != undefined;
        },
    };
    export interface TreeUtils {
        tagfunc(item: any): any;
        keyfunc(item: any): string;
        filterfunc(item: any): boolean;
        branchfunc(state: State<any>): State<any[]>;
        resolvefunc(item: any, i: any, node: TreeNode): State<any>;
        addfunc(item: TreeNode): void;
        movefunc(from: TreeNode, to: TreeNode): void;
        removefunc(item: TreeNode): void;
    }
    export interface TreeNode {
        root: State<any>
        nested: boolean
        parentId: string
        state: State<any>
        depth: number
        showingChildren: boolean
        isContainer(): boolean
        id: string
        i: number
        children: State<any[]>
        children$: Observable<any[]>
        nodes: Record<string, TreeNode>
        remove(id?)
        add(id, data, i)
        move(fromId, toId, data, i)
        draggable(node, params)
        droppable(node, params)
        bind(...keys: string[])
    }
</script>

<script lang="ts">
    export let nodes: Record<string, TreeNode> = {};
    export let tagfunc = defaults.tagfunc;
    export let keyfunc = defaults.keyfunc;
    export let branchfunc = defaults.branchfunc;
    export let resolvefunc = defaults.resolvefunc;
    export let filterfunc = defaults.filterfunc;
    export let verifyfunc = defaults.verifyfunc;
    export let createMergeData: Record<string, any> = {};
    export let nested = false;
    export let parentId: string;
    export let ancestors: string[]= [];
    export let state: State<any>;
    export let root: State<any> = state;
    export let id = keyfunc($state);
    export let depth = -1;
    export let i = 0;
    export let showingChildren = true;
    export const children = branchfunc(state);
    export const children$ = children;
    export function isContainer() {
        return $children$ instanceof Array;
    }
    export const isRoot = depth === -1;
    export function remove(targetId: string = id) {
        nodes[targetId].state.delete();
    }
    export async function move(
        fromId: string = id,
        toId: string,
        index: number = nodes[toId].i,
        data: any = nodes[fromId].state.value
    ) {
        if (fromId === toId || ancestors.includes(fromId)) {
            return;
        }
        const payload = nodes[fromId];
        const targetNode = nodes[toId];
        const targetIsContainer = targetNode?.isContainer();
        const payloadInTarget = targetNode?.children?.value?.some(
                (value) => keyfunc(value) === fromId
        );
        const parentId = targetNode?.parentId;
        const targetParentNode = nodes[parentId];
        const payloadInParent = targetParentNode?.children.value?.some(
            (value) => keyfunc(value) === fromId
        );
        if (!targetParentNode) return;
        if (targetIsContainer && !payloadInTarget) {
            payload?.remove();
            await tick();
            add(toId, data, i);
        } else if (payloadInParent) {
            targetParentNode.children.value = arrayMove(
                [...targetParentNode.children.value],
                nodes[fromId].i,
                index
            );
        } else if (Array.isArray(targetParentNode.children.value)) {
            nodes[fromId]?.remove();
            await tick();
            add(parentId, data, i);
        } else {

        }
    }
    export function add(targetId = id, data = {}, i?) {
        data = { ...data, ...createMergeData };
        const targetNode = nodes[targetId];
        if (!targetNode) return
        const id = keyfunc(data);
        if (!id) {
            tagfunc(data);
        }
        const valid = verifyfunc(data);
        const nv = [...(targetNode.children.value || [])];
        if (typeof i === "number") {
            nv.splice(i, 0, data);
        } else {
            nv.push(data);
        }
        if (valid) {
            targetNode.children.value = nv;
        }
    }
    export function draggable(node: HTMLElement, params) {
        const subs: Subscription[] = [];
        node.draggable = true;
        const dragstart = fromEvent<DragEvent>(node, "dragstart").pipe(
            tap((e) =>
                e.dataTransfer.setData("text/plain", JSON.stringify({ id }))
            ),
            tap((e) =>
                e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify(state.value)
                )
            )
        );
        subs.push(
            dragstart.subscribe(),
        );
        return {
            destroy() {
                subs.forEach((sub) => sub.unsubscribe());
            },
        };
    }
    export function droppable(node: HTMLElement, params) {
        const subs = [];
        const dragenter = fromEvent<DragEvent>(node, "dragenter").pipe(
            tap((e) => e.preventDefault())
        );
        const dragover = fromEvent<DragEvent>(node, "dragover").pipe(
            tap((e) => e.preventDefault())
        );
        const drop = fromEvent<DragEvent>(node, "drop").pipe(
            tap(async (e) => {
                const { id: _id } = JSON.parse(
                    e.dataTransfer.getData("text/plain")
                );
                const appJson = e.dataTransfer.getData("application/json");
                try {
                    const payload = nodes[_id];
                    const data = appJson ? JSON.parse(appJson) : payload.state.value
                    if (payload) {
                        move(
                            _id,
                            id,
                            i,
                           data
                        );
                    } else if (appJson) {
                        tagfunc(data);
                        add(parentId, data, i);
                    }
                } catch (err) {}
            })
        );
        subs.push(
            dragenter.subscribe(),
            dragover.subscribe(),
            drop.subscribe()
        );
        return {
            destroy() {
                subs.forEach((sub) => sub.unsubscribe());
            },
        };
    }
    export function bind(...keys: string[]) {
        return function(this: Event, e: Event) {
            const target = e.target as HTMLElement;
            const sub = state.sub(...keys);
            const value = target["value"];
            if (value) sub.value = value;
        }
    }
    const node: TreeNode = {
        root,
        get nested() { return nested; },
        set nested(val) { nested = val; },
        parentId,
        state,
        depth,
        get showingChildren() { return showingChildren },
        set showingChildren(val) { showingChildren = val },
        isContainer,
        id,
        i,
        children,
        children$,
        nodes,
        remove,
        add,
        move,
        draggable,
        droppable,
        bind
    };
    onMount(() => {
        if (!id) {
            state.value = { ...tagfunc(state.value) };
        }
        () => delete nodes[id]
    });
    nodes[id] = node;
    $: nodes[id] = node;
    setContext(TreeSymbol, node);
</script>

{#if nested}
    <div>
        {#if filterfunc($state)}
            <slot
                {node}
                value={$state}
                children={$children}
                id={keyfunc($state)}
            />
        {/if}
        {#if $children$ instanceof Array && showingChildren}
            {#each $children$ as child, i (i)}
                <svelte:self
                    {nested}
                    parentId={id}
                    ancestors={[...ancestors, id]}
                    state={resolvefunc(child, i, children)}
                    id={keyfunc(child)}
                    depth={depth + 1}
                    {i}
                    {tagfunc}
                    {keyfunc}
                    {branchfunc}
                    {resolvefunc}
                    {filterfunc}
                    {verifyfunc}
                    {root}
                    {createMergeData}
                    {nodes}
                    let:node
                    let:value
                    let:children
                    let:id
                >
                    <slot {node} {value} {children} {id} />
                </svelte:self>
            {/each}
        {/if}
    </div>
{:else}
    {#if filterfunc($state)}
        <slot
            {node}
            value={$state}
            children={$children}
            id={keyfunc($state)}
        />
    {/if}
    {#if $children$ instanceof Array && showingChildren}
        {#each $children$ as child, i (i)}
            <svelte:self
                {nested}
                parentId={id}
                ancestors={[...ancestors, id]}
                state={resolvefunc(child, i, children)}
                id={keyfunc(child)}
                depth={depth + 1}
                {i}
                {tagfunc}
                {keyfunc}
                {branchfunc}
                {resolvefunc}
                {filterfunc}
                {verifyfunc}
                {root}
                {createMergeData}
                {nodes}
                let:node
                let:value
                let:children
                let:id
            >
                <slot {node} {value} {children} {id} />
            </svelte:self>
        {/each}
    {/if}
{/if}
