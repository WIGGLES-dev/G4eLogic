<script lang="ts" context="module">
    type UseFunc = (
        node: HTMLElement,
        params?
    ) => { update?(params); destroy?() } | void;
    export interface TreeHashNode<T> {
        id: string;
        parentId;
        path: Path;
        i: number;
        order: number;
        depth: number;
        ancestors: string[];
        value: T;
        showing: boolean;
        children: any[];
    }
    export interface TreeNode<T> extends TreeHashNode<T> {
        state: State<T>;
        showingChildren$: State<boolean>;
        isContainer$: State<boolean>;
        indent: number;
        showing: boolean;
        add(): void;
        remove(): void;
        draggable: UseFunc;
        droppable: UseFunc;
    }
</script>

<script lang="ts">
    import { State } from "rxdeep";
    import {
        getValueAtPath,
        updateValueAtPath,
        move as moveObject,
        Path,
    } from "@utils/object";
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
    $: nodeMap = hashNodes($tree);
    $: nodeList = Object.values(nodeMap).filter(prune).map(makeNode);
    function hashNodes(root) {
        let order = 0;
        const nodes = {} as TreeHashNode<any>;
        function descend(node, i?, path = [], depth = 0, ancestors = []) {
            const id = getValueAtPath(node, idPath);
            const children = getValueAtPath(node, branchPath);
            const [parentId] = ancestors.slice(-1);
            const showing = ancestors.every((id) => {
                const value = nodes[id].value;
                const isContainer =
                    getValueAtPath(value, containerPath) === true;
                const showingChildren =
                    getValueAtPath(value, showPath) === true;
                return isContainer ? showingChildren : true;
            });
            nodes[id] = {
                id,
                parentId,
                path,
                ancestors,
                depth,
                value: node,
                i,
                order: ++order,
                children,
                showing: showCollapsed ? true : showing,
            };
            if (depth < maxDepth) {
                const children = getValueAtPath(node, branchPath);
                if (children instanceof Array) {
                    children.forEach((child, i) => {
                        const _path = [...path, ...branchPath, i];
                        descend(child, i, _path, depth + 1, [...ancestors, id]);
                    });
                } else if (typeof children === "object") {
                    Object.entries(children).forEach(([key, value], i) => {
                        const _path = [...path, ...branchPath, key];
                        descend(value, i, _path, depth + 1, [...ancestors, id]);
                    });
                }
            }
        }
        descend(root);
        return nodes;
    }
    const stateCache: Record<string, State<any>> = {};
    function makeNode(node: TreeHashNode<any>): TreeNode<any> {
        const {
            id,
            parentId,
            ancestors,
            path,
            depth,
            i,
            value,
            children,
            showing,
            order,
        } = node;
        const state = tree.sub(...path);
        const showingChildren$ = state.sub(...showPath);
        const isContainer$ = state.sub(...containerPath);
        const isContainer = isContainer$.value;
        return {
            id,
            parentId,
            path,
            state,
            showingChildren$,
            isContainer$,
            indent: depth,
            depth,
            i,
            order,
            value,
            ancestors,
            showing,
            children,
            add() {
                add(id);
            },
            remove() {
                remove(id);
            },
            draggable(node, params?) {
                if (disableDrag) return;
                const subs: Subscription[] = [];
                node.draggable = !disableDrag;
                const dragstart = fromEvent<DragEvent>(node, "dragstart").pipe(
                    tap((e) =>
                        e.dataTransfer.setData(
                            "text/plain",
                            JSON.stringify({ id })
                        )
                    ),
                    tap((e) =>
                        e.dataTransfer.setData(
                            "application/json",
                            JSON.stringify(value)
                        )
                    )
                );
                subs.push(dragstart.subscribe());
                return {
                    destroy() {
                        subs.forEach((sub) => sub.unsubscribe());
                    },
                };
            },
            droppable(node, params?) {
                if (disableDrop) return;
                const subs = [];
                const dragenter = fromEvent<DragEvent>(node, "dragenter").pipe(
                    tap((e) => e.preventDefault())
                );
                const dragleave = fromEvent<DragEvent>(
                    node,
                    "dragleave"
                ).pipe();
                const dragover = fromEvent<DragEvent>(node, "dragover").pipe(
                    tap((e) => e.preventDefault()),
                    tap((e) => {
                        const { clientX, clientY } = e;
                        const elem = document.elementFromPoint(
                            clientX,
                            clientY
                        );
                        const onToggle = elem.matches("[data-toggle]");
                        if (onToggle && isContainer === true) {
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
                        const appJson = e.dataTransfer.getData(
                            "application/json"
                        );
                        try {
                            const payload = nodeMap[_id];
                            const { children } = nodeMap[id];
                            const data = appJson
                                ? JSON.parse(appJson)
                                : payload.state.value;
                            const { clientX, clientY } = e;
                            const elem = document.elementFromPoint(
                                clientX,
                                clientY
                            );
                            const onToggle = elem.matches("[data-toggle]");
                            const payloadInContainer = children?.some(
                                (v) => getValueAtPath(v, idPath) === _id
                            );
                            const valid = verify(data);
                            console.log(valid);
                            if (payload && valid) {
                                if (
                                    isContainer === true &&
                                    !payloadInContainer &&
                                    onToggle
                                ) {
                                    console.log("Toggle Drop");
                                    move(_id, id, { nest: branchPath });
                                } else if (!onToggle) {
                                    move(_id, id);
                                }
                            } else if (data) {
                                data["id"] = v4();
                                //updateValueAtPath(data, idPath, v4());
                                add(
                                    isContainer === true && onToggle
                                        ? id
                                        : parentId,
                                    data,
                                    i
                                );
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
            },
        };
    }
    export function getNode(id) {
        return nodeList.find((node) => node.id === id);
    }
    export function remove(id?) {
        getNode(id)?.state?.delete();
    }
    export async function move(fromId: string, toId: string, opts?) {
        const target = getNode(fromId);
        const payload = getNode(toId);
        const targetBranch = payload.parentId;
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
        const _id = getValueAtPath(data, idPath);
        if (_id == null) {
            data["id"] = v4();
            //updateValueAtPath(data, idPath, v4());
        }
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
