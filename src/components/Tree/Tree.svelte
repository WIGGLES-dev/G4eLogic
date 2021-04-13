<script context="module" lang="ts">
    export const TreeSymbol = Symbol("Tree");
    export interface TreeNode {
        root: State<any>;
        parentId: string;
        state: State<any>;
        depth: number;
        indent: number;
        showing: boolean;
        id: string;
        i: number;
        children: State<any[]>;
        isContainer$: State<boolean>;
        showingChildren$: State<boolean>;
        isInNodeTree: boolean;
        remove(id?);
        add(id, data, i);
        move(fromId, toId, data, i);
        draggable(node, params);
        droppable(node, params);
        bind(...keys: string[]);
    }
</script>

<script lang="ts">
    import { v4 } from "uuid";
    import { State } from "rxdeep";
    import { fromEvent, Subscription } from "rxjs";
    import { onMount, afterUpdate } from "svelte";
    import { move as moveObject } from "@utils/object";
    import { tap } from "rxjs/operators";
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
        verifyfunc(item) {
            return item !== undefined;
        },
        isContainer(state: State<any>): State<boolean> {
            return state.sub("isContainer");
        },
        showingChildren(state: State<any>): State<boolean> {
            return state.sub("showingChildren");
        },
    };
    export let state: State<any>;

    export let root: State<any> = state;
    export let tagfunc = defaults.tagfunc;
    export let keyfunc = defaults.keyfunc;
    export let branchfunc = defaults.branchfunc;
    export let resolvefunc = defaults.resolvefunc;
    export let filterfunc = defaults.filterfunc;
    export let verifyfunc = defaults.verifyfunc;
    export let isContainer = defaults.isContainer;
    export let showingChildren = defaults.showingChildren;
    export let nodes: Record<string, TreeNode> = {};
    export let mergeData: Record<string, any> = {};
    export let maxDepth = Number.POSITIVE_INFINITY;
    export let disableDrag = false;
    export let disableDrop = false;
    export let appendable = true;
    export let showCollapsed = false;
    $: pass = {
        root,
        tagfunc,
        keyfunc,
        branchfunc,
        filterfunc,
        verifyfunc,
        resolvefunc,
        isContainer,
        showingChildren,
        nodes,
        mergeData,
        maxDepth,
        disableDrag,
        disableDrop,
        appendable,
        showCollapsed,
    };
    export let parentId: string = null;
    export let ancestors: string[] = [];
    export let depth = 0;
    export let indent = depth;
    export let i = 0;
    export let showing = true;
    export const children = branchfunc(state);
    const subNodes = children;
    export const isContainer$ = isContainer(state);
    export const showingChildren$ = showingChildren(state);
    $: id = keyfunc($state);
    export async function add(targetId = id, data = {}, i?) {
        if (!appendable) return;
        data = { ...data, ...mergeData };
        const targetNode = nodes[targetId] || node;
        if (!targetNode) return;
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
    export async function remove(targetId: string = id) {
        nodes[targetId].state.delete();
    }
    export async function move(fromId: string = id, toId: string, opts?) {
        if (fromId === toId || ancestors.includes(fromId)) {
            return;
        }
        const payload = nodes[fromId];
        const target = nodes[toId];
        if (!target || !payload) return;
        root.value = moveObject(
            root.value,
            (value) => keyfunc(value) === fromId,
            (value) => keyfunc(value) === toId,
            opts
        );
    }
    let draggingOver = false;
    export function draggable(node: HTMLElement, params) {
        const subs: Subscription[] = [];
        node.draggable = !disableDrag;
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
        subs.push(dragstart.subscribe());
        return {
            destroy() {
                subs.forEach((sub) => sub.unsubscribe());
            },
        };
    }
    export function droppable(node: HTMLElement, params) {
        if (disableDrop) return;
        const subs = [];
        const dragenter = fromEvent<DragEvent>(node, "dragenter").pipe(
            tap((e) => e.preventDefault()),
            tap((e) => (draggingOver = true))
        );
        const dragleave = fromEvent<DragEvent>(node, "dragleave").pipe(
            tap((e) => (draggingOver = false))
        );
        const dragover = fromEvent<DragEvent>(node, "dragover").pipe(
            tap((e) => e.preventDefault()),
            tap((e) => {
                const { clientX, clientY } = e;
                const elem = document.elementFromPoint(clientX, clientY);
                const onToggle = elem.matches("[data-toggle]");
                if (onToggle && $isContainer$) {
                    e.dataTransfer.dropEffect = "link";
                } else {
                    e.dataTransfer.dropEffect = "move";
                }
            })
        );
        const drop = fromEvent<DragEvent>(node, "drop").pipe(
            tap(async (e) => {
                const txt = e.dataTransfer.getData("text/plain");
                const { id: _id } = txt ? JSON.parse(txt) : ({} as any);
                const appJson = e.dataTransfer.getData("application/json");
                try {
                    const payload = nodes[_id];
                    const data = appJson
                        ? JSON.parse(appJson)
                        : payload.state.value;
                    const { clientX, clientY } = e;
                    const elem = document.elementFromPoint(clientX, clientY);
                    const onToggle = elem.matches("[data-toggle]");
                    const payloadInContainer = $children?.some(
                        (v) => keyfunc(v) === _id
                    );
                    if (payload) {
                        if ($isContainer$ && !payloadInContainer && onToggle) {
                            move(_id, id, { nest: ["children"] });
                        } else if (!onToggle) {
                            move(_id, id);
                        }
                    } else if (data) {
                        tagfunc(data);
                        add($isContainer$ && onToggle ? id : parentId, data, i);
                    }
                } catch (err) {
                    console.log(err);
                }
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
        return function (this: Event, e: Event) {
            const target = e.target as HTMLElement;
            const sub = state.sub(...keys);
            const value = target["value"];
            if (value) sub.value = value;
        };
    }

    $: node = {
        root,
        parentId,
        state,
        depth,
        get indent() {
            return indent;
        },
        get showing() {
            return filterfunc($state) && $showingChildren$ === true;
        },
        id,
        i,
        children,
        isContainer$,
        showingChildren$,
        get isInNodeTree() {
            return nodes[this.id]?.id === this?.id;
        },
        remove,
        add,
        move,
        draggable,
        droppable,
        bind,
    };
    $: visible = showCollapsed
        ? filterfunc($state)
        : showing && filterfunc($state);
    onMount(() => {
        nodes[id] = node;
        if (!id) {
            state.value = { ...tagfunc(state.value) };
        }
        return () => {
            delete nodes[id];
        };
    });
    afterUpdate(() => {
        nodes[id] = node;
    });
</script>

{#if depth <= maxDepth}
    <slot
        {node}
        value={$state}
        children={$children}
        showing={visible}
        showingChildren={$showingChildren$}
        isContainer={$isContainer$}
        {id}
        {indent}
        {draggingOver}
    />
    {#each $subNodes || [] as child, i (i)}
        <svelte:self
            parentId={id}
            ancestors={[...ancestors, id]}
            state={resolvefunc(child, i, children)}
            depth={depth + 1}
            indent={depth + 1}
            showing={showing && ($isContainer$ ? $showingChildren$ : true)}
            {i}
            {...pass}
            let:node
            let:value
            let:children
            let:showing
            let:showingChildren
            let:isContainer
            let:id
            let:indent
        >
            <slot
                {node}
                {value}
                {children}
                {showing}
                {showingChildren}
                {isContainer}
                {id}
                {indent}
            />
        </svelte:self>
    {/each}
{/if}
