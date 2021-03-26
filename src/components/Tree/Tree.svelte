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
        tagfunc;
        keyfunc;
        branchfunc;
        resolvefunc;
        filterfunc;
        verifyfunc;
        nested: boolean;
        parentId: string;
        state: State<any>;
        depth: number;
        showingChildren: boolean;
        isContainer(): boolean;
        id: string;
        i: number;
        children: State<any[]>;
        children$: Observable<any[]>;
        nodes: Record<string, TreeNode>;
        remove(): void;
        move;
        draggable;
        add;
    }
</script>

<script lang="ts">
    const current_component = get_current_component();
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
    export let state: State<any>;
    export let root: State<any> = state;
    export let id = keyfunc($state);
    nodes[id] = current_component;
    export let depth = -1;
    export let i = 0;
    export let showingChildren = true;
    setContext(TreeSymbol, get_current_component());
    export const children = branchfunc(state);
    export const children$ = children;
    export function isContainer() {
        return $children$ instanceof Array;
    }
    export const isRoot = depth === -1;
    export function getAncestors(nodeId = id) {
        const node = nodes[nodeId];
        let chain: TreeNode[] = [];
        function crawl(node: TreeNode) {
            const parentId = node?.parentId;
            const parent = nodes[parentId];
            if (parent) {
                chain.push(parent);
                crawl(parent);
            }
        }
        if (node) crawl(node);
        return chain;
    }
    export function remove(targetId: string = id) {
        nodes[targetId].state.delete();
    }
    export async function move(
        fromId: string = id,
        toId: string,
        index: number = nodes[toId].i,
        data: any = nodes[fromId].state.value
    ) {
        const chain = getAncestors(toId);
        if (fromId === toId || chain.some((node) => node.id === fromId)) {
            return;
        }
        const targetNode = nodes[toId];
        const parentId = targetNode?.parentId;
        const targetParentNode = nodes[parentId];
        const payloadInParent = targetParentNode?.children.value?.some(
            (value) => keyfunc(value) === fromId
        );
        if (!targetParentNode) {
            return;
        }
        if (payloadInParent) {
            targetParentNode.children.value = arrayMove(
                [...targetParentNode.children.value],
                nodes[fromId].i,
                index
            );
        } else if (Array.isArray(targetParentNode.children.value)) {
            nodes[fromId]?.remove();
            await tick();
            const targetNode = nodes[toId];
            const parentId = targetNode?.parentId;
            const targetIsContainer = targetNode?.isContainer();
            const payloadInTarget = targetNode?.children?.value?.some(
                (value) => keyfunc(value) === fromId
            );
            if (targetIsContainer && !payloadInTarget) {
                add(toId, data, i);
            } else {
                add(parentId, data, i);
            }
        } else {
        }
    }
    export function add(targetId = id, data = {}, i?) {
        data = { ...data, ...createMergeData };
        const targetNode = nodes[targetId];
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
        const dragenter = fromEvent<DragEvent>(node, "dragenter").pipe(
            tap((e) => e.preventDefault())
        );
        const dragover = fromEvent<DragEvent>(node, "dragover").pipe(
            tap((e) => e.preventDefault())
        );
        const drop = fromEvent<DragEvent>(node, "drop").pipe(
            tap((e) => {
                const { id: _id } = JSON.parse(
                    e.dataTransfer.getData("text/plain")
                );
                const appJson = e.dataTransfer.getData("application/json");
                try {
                    const target = nodes[_id];
                    const data = JSON.parse(appJson);
                    const rootId = data?.rootId ?? NaN;
                    if (
                        nodes[_id]?.id === _id &&
                        nodes[_id]?.state?.value?.rootId === rootId
                    ) {
                        move(
                            _id,
                            id,
                            i,
                            appJson
                                ? JSON.parse(appJson)
                                : nodes[_id].state.value
                        );
                    } else if (appJson) {
                        tagfunc(data);
                        add(parentId, data, i);
                    }
                } catch (err) {}
            })
        );
        subs.push(
            dragstart.subscribe(),
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
    onMount(() => {
        if (!id) {
            state.value = { ...tagfunc(state.value) };
        }
    });
    onDestroy(() => {
        delete nodes[id];
    });
    $: nodes[id] = get_current_component();
</script>

{#if nested}
    <div>
        {#if filterfunc($state)}
            <slot
                node={get_current_component()}
                value={$state}
                children={$children}
                id={keyfunc($state)}
            />
        {/if}
        {#if $children$ instanceof Array && showingChildren}
            {#each $children$ as child, i (i)}
                <svelte:self
                    parentId={id}
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
            node={get_current_component()}
            value={$state}
            children={$children}
            id={keyfunc($state)}
        />
    {/if}
    {#if $children$ instanceof Array && showingChildren}
        {#each $children$ as child, i (i)}
            <svelte:self
                parentId={id}
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
