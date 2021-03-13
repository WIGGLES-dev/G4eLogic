<svelte:options accessors={true} />

<script context="module" lang="ts">
    import { v4 } from "uuid";
    import { State } from "rxdeep";
    import { fromEvent, Subscription } from "rxjs";
    import { tap, filter } from "rxjs/operators";
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
    import { arrayMove } from "@internal";
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
        branchfunc(state) {
            return state?.sub("children");
        },
        resolvefunc(item, i, branch) {
            return branch?.sub(i);
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
        resolvefunc(item: any, i: any, branch: State<any[]>): State<any>;
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
        id: string;
        i: number;
        children: State<any[]>;
        nodes: Record<string, TreeNode>;
        remove;
        move;
        draggable;
        parent(id?: string): TreeNode;
    }
</script>

<script lang="ts">
    const current_component = get_current_component();
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
    export let id = keyfunc($state);
    export let depth = -1;
    export let i = 0;
    export let showingChildren = true;
    export let nodes: Record<string, TreeNode> = {};
    setContext(TreeSymbol, get_current_component());
    export const children = branchfunc(state);
    export const isRoot = depth === -1;
    export function getAncestors(nodeId = id) {
        const node = nodes[nodeId];
        let chain: TreeNode[] = [];
        function crawl(node: TreeNode) {
            const parent = node?.parent();
            if (parent) {
                chain.push(parent);
                crawl(parent);
            }
        }
        crawl(node);
        return chain;
    }
    export function parent(targetId = id) {
        const parentId = nodes[targetId]?.parentId;
        return nodes[parentId];
    }
    export function remove(targetId: string = id) {
        const targetNode = nodes[targetId];
        const targetParentNode = targetNode?.parent();
        if (Array.isArray(targetParentNode?.children?.value)) {
            targetParentNode.children.value = targetParentNode.children.value.filter(
                (v) => keyfunc(v) !== targetId
            );
        }
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
        const targetParentNode = targetNode?.parent();
        if (!targetParentNode) return;
        if (
            targetParentNode.children.value?.some(
                (value) => keyfunc(value) === fromId
            )
        ) {
            targetParentNode.children.value = arrayMove(
                [...targetParentNode.children.value],
                nodes[fromId].i,
                index
            );
        } else if (Array.isArray(targetParentNode.children.value)) {
            const newValue = [...targetParentNode.children.value];
            newValue.splice(index, 0, { ...data });
            remove(fromId);
            await tick();
            nodes[toId].parent().children.value = newValue;
        }
    }
    export function add(data = {}) {
        data = { ...data, ...createMergeData };
        const id = keyfunc(data);
        if (!id) {
            tagfunc(data);
        }
        const valid = verifyfunc(data);
        if (valid) {
            children.value = [...(children.value || []), data];
        }
    }
    export function draggable(node: HTMLElement, params) {
        const subs: Subscription[] = [];
        node.draggable = true;
        const dragstart = fromEvent<DragEvent>(node, "dragstart").pipe(
            tap((e) => e.dataTransfer.setData("text/plain", id)),
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
            filter(
                (e) =>
                    !getAncestors()?.some(
                        (node) =>
                            node.id === e.dataTransfer.getData("text/plain")
                    )
            ),
            tap((e) => {
                const _id = e.dataTransfer.getData("text/plain");
                const data = e.dataTransfer.getData("application/json");
                if (nodes[_id]) {
                    move(
                        _id,
                        id,
                        i,
                        JSON.parse(data) || nodes[_id].state.value
                    );
                } else {
                }
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
    afterUpdate(() => {
        nodes[id] = current_component;
    });
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
        {#if $children instanceof Array && showingChildren}
            {#each $children as child, i (i)}
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
                    {nodes}
                    {createMergeData}
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
    {#if $children instanceof Array && showingChildren}
        {#each $children as child, i (i)}
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
                {nodes}
                {createMergeData}
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
