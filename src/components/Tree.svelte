<script lang="ts" context="module">
    type UseFunc = (
        node: HTMLElement,
        params?
    ) => { update?(params); destroy?() } | void;
    export interface TreeHashNode<T = any> {
        id: string;
        parentId;
        path: Path;
        i: number;
        pruned: boolean;
        order: number;
        depth: number;
        indent: number;
        ancestors: string[];
        value: T;
        showing: boolean;
        children: any[];
        isContainer: boolean;
        showingChildren: boolean;
    }
    export interface TreeNode<T = any> extends TreeHashNode<T> {
        state: State<T>;
        showingChildren$: State<boolean>;
        isContainer$: State<boolean>;
        children$: State<T[]>;
        add(): void;
        remove(): void;
        draggable: UseFunc;
        droppable: UseFunc;
    }
</script>

<script lang="ts">
    import { State } from "rxdeep";
    import { getValueAtPath, updateValueAtPath } from "@utils/path";
    import { move as moveObject } from "@utils/tree";
    import type { Path } from "@utils/path";
    import { fromEvent, Subscription } from "rxjs";
    import { tap } from "rxjs/operators";
    import { v4 } from "uuid";
    export let key: string;
    export let tree: State<Record<string, any>>;
    export let branchPath: Path = ["children"];
    export let containerPath: Path = ["isContainer"];
    export let showPath: Path = ["showingChildren"];
    export let idPath: Path = ["id"];
    export let maxDepth = Number.POSITIVE_INFINITY;
    export let mergeData: Record<string, any> = {};
    export let showCollapsed = false;
    export let verify = (v) => true;
    export let prune = (node, i, nodeList) => true;
    export let vList: string[] = null;
    export let disableDrag = false;
    export let disableDrop = false;
    $: nodeMap = hashNodes($tree, showCollapsed);
    $: nodeList = Object.values(nodeMap).filter(prune).map(makeNode);
    function hashNodes(root, showCollapsed = false) {
        let order = 0;
        const nodes = {} as TreeHashNode<any>;
        function descend(
            node,
            i?,
            path = [],
            depth = 0,
            indent = 0,
            ancestors = []
        ) {
            const id = getValueAtPath(node, idPath);
            if (id == null) {
                updateValueAtPath(node, idPath, v4());
            }
            const children = getValueAtPath(node, branchPath);
            const [parentId] = ancestors.slice(-1);
            const isContainer = getValueAtPath(node, containerPath) === true;
            const showingChildren = getValueAtPath(node, showPath) === true;
            const showing = ancestors.every((id) => {
                const { isContainer, showingChildren } = nodes[id];
                return isContainer ? showingChildren : true;
            });
            nodes[id] = {
                id,
                parentId,
                path,
                ancestors,
                depth,
                indent,
                value: node,
                i,
                order: ++order,
                children,
                showing: showCollapsed ? true : showing,
                isContainer,
                showingChildren,
            };
            if (depth < maxDepth) {
                const children = getValueAtPath(node, branchPath);
                const _depth = depth + 1;
                const _indent = depth + 1;
                let i = 0;
                if (children instanceof Array) {
                    for (const child of children) {
                        const _path = [...path, ...branchPath, i];
                        descend(child, i++, _path, _depth, _indent, [
                            ...ancestors,
                            id,
                        ]);
                    }
                } else if (typeof children === "object") {
                    for (const [key, value] of Object.entries(children)) {
                        const _path = [...path, ...branchPath, key];
                        descend(value, i++, _path, _depth, _indent, [
                            ...ancestors,
                            id,
                        ]);
                    }
                }
            }
        }
        descend(root);
        return nodes;
    }
    function makeNode(node: TreeHashNode<any>): TreeNode<any> {
        const { id, path, depth } = node;
        const state = tree.sub(...path);
        const showingChildren$ = state.sub(...showPath);
        const isContainer$ = state.sub(...containerPath);
        const children$ = state.sub(...branchPath);
        return {
            ...node,
            state,
            showingChildren$,
            isContainer$,
            children$,
            add() {
                return add(id);
            },
            remove() {
                return remove(id);
            },
            draggable(element, params?) {
                return draggable(element, id);
            },
            droppable(element, params?) {
                return droppable(element, id);
            },
        };
    }
    export function getNode(id): TreeNode<any> {
        const nodeInList = nodeList.find((node) => node.id === id);
        if (nodeInList?.id === id) return nodeInList;
        const nodeInHash = nodeMap[id];
        if (nodeInHash?.id === id) {
            return makeNode(nodeInHash);
        }
    }
    export function handlers(nodeId: string) {
        function isInsertOperation(e: MouseEvent) {
            const { isContainer, id, parentId, i, value } = getNode(nodeId);
            const target = e.target;
            if (target instanceof Element) {
                const tr = target.closest<HTMLTableRowElement>(`tr[data-id]`);
                const bbox = tr.getBoundingClientRect();
                const { clientX, clientY } = e;
                const elem = document.elementFromPoint(clientX, clientY);
                const onToggle = elem.matches("[data-toggle]");
                const inUpperHalf =
                    clientY > bbox.top &&
                    clientY < bbox.bottom &&
                    clientY - bbox.top < bbox.height / 2;
                const inRightHalf =
                    clientX > bbox.left &&
                    clientX < bbox.right &&
                    clientX - bbox.left < bbox.width / 2;
                if ((onToggle || inUpperHalf) && isContainer === true) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        async function drop(e: DragEvent) {
            const { isContainer, id, parentId, i, value } = getNode(nodeId);
            const { dataTransfer } = e;
            const txt = dataTransfer.getData("text/plain");
            const { id: _id, type: _type } = txt
                ? JSON.parse(txt)
                : ({} as { id: string; type: string });
            const appJson = dataTransfer.getData("application/json");
            try {
                const payload = getNode(_id);
                const data = appJson ? JSON.parse(appJson) : payload.value;
                const valid = verify(data);
                const link =
                    e.dataTransfer.dropEffect === "link" ||
                    isInsertOperation(e);
                if (payload && valid) {
                    const { children } = payload;
                    const payloadInContainer = children?.some(
                        (v) => getValueAtPath(v, idPath) === _id
                    );
                    if (isContainer && !payloadInContainer && link) {
                        move(_id, id, { nest: branchPath });
                    } else if (!link) {
                        move(_id, id);
                    }
                } else if (valid) {
                    updateValueAtPath(data, idPath, v4());
                    add(isContainer === link ? id : parentId, data, i);
                } else {
                }
            } catch (err) {
                console.log(err);
            }
        }
        async function dragover(e: DragEvent) {
            if (isInsertOperation(e)) {
                e.dataTransfer.dropEffect = "link";
            } else {
                e.dataTransfer.dropEffect = "move";
            }
        }
        async function dragstart(e: DragEvent) {
            const { isContainer, id, parentId, i, value } = getNode(nodeId);
            e.dataTransfer.setData("text/plain", JSON.stringify({ id }));
            e.dataTransfer.setData("application/json", JSON.stringify(value));
        }
        return {
            drop,
            dragover,
            dragstart,
        };
    }
    export function draggable(node: HTMLElement, nodeId: string) {
        if (disableDrag) return;
        const eHandlers = handlers(nodeId);
        const subs: Subscription[] = [];
        node.draggable = !disableDrag;
        const dragstart$ = fromEvent<DragEvent>(node, "dragstart");
        const sub1 = dragstart$.pipe(tap(eHandlers.dragstart));
        subs.push(sub1.subscribe());
        return {
            destroy() {
                subs.forEach((sub) => sub.unsubscribe());
            },
        };
    }
    export function droppable(node: HTMLElement, nodeId: string) {
        if (disableDrop) return;
        const eHandlers = handlers(nodeId);
        const subs = [];
        const dragenter$ = fromEvent<DragEvent>(node, "dragenter");
        const dragleave$ = fromEvent<DragEvent>(node, "dragleave");
        const dragover$ = fromEvent<DragEvent>(node, "dragover");
        const drop$ = fromEvent<DragEvent>(node, "drop");
        const dragend$ = fromEvent<DragEvent>(node, "dragend");
        const sub1 = dragover$
            .pipe(tap((e) => e.preventDefault()))
            .subscribe(eHandlers.dragover);
        const sub2 = drop$.subscribe(eHandlers.drop);
        const sub3 = dragenter$
            .pipe(tap((e) => e.preventDefault()))
            .subscribe();
        subs.push(sub1, sub2, sub3);
        return {
            destroy() {
                subs.forEach((sub) => sub.unsubscribe());
            },
        };
    }
    export function remove(id?) {
        getNode(id)?.state?.delete();
    }
    export async function move(fromId: string, toId: string, opts?) {
        const target = getNode(fromId);
        const payload = getNode(toId);
        const { ancestors } = payload;
        if (
            !target ||
            !payload ||
            fromId === toId ||
            ancestors?.includes(fromId)
        ) {
            return;
        }
        const moved = moveObject(
            tree.value,
            (value) => getValueAtPath(value, idPath) === fromId,
            (value) => getValueAtPath(value, idPath) === toId,
            opts
        );
        tree.value = moved;
    }

    export function add(id?, data = {}, i?) {
        const state = getNode(id)?.state || tree;
        data = { ...data, ...mergeData };
        hashNodes(data);
        const valid = typeof verify === "function" ? verify(data) : false;
        if (valid) {
            const children = state.sub(...branchPath);
            let nv = [...children.value];
            if (i > 0 && i < children?.value?.length) {
                nv.splice(i, 0, data);
            } else {
                nv.push(data);
            }
            children.value = nv;
        }
    }
</script>

{#each nodeList as node, i (node.id)}
    <slot {node} />
{/each}
