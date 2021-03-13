<script context="module" lang="ts">
    import { State } from "rxdeep";
    import { fragment, System, Resource, lift, colSpanMax } from "@internal";
    import { push } from "svelte-spa-router";
    import Tree from "@components/Tree/Tree.svelte";
    import Popper from "@components/Popper.svelte";
    import Menu from "@components/Menu/Menu.svelte";
</script>

<script lang="ts">
    import Option from "@components/Form/Select/Option.svelte";
    import { children } from "svelte/internal";

    export let root: Resource;
    export let type: string;
    export let ctxoptions = [];
    export let filterfunc: Tree["$$prop_def"]["filterfunc"] = (item) => true;
    export let verifyfunc: Tree["$$prop_def"]["verifyfunc"] = (item) => !!item;
    export let createMergeData: Record<string, any> = {
        rootId: root.id,
    };
    let tree: Tree;
    export let menu: Menu;
    function resolvefunc(node: any, i: any, branch: State<any[]>) {
        return new Resource(branch.sub(i));
    }
    function branchfunc(state$: Resource) {
        if (type === "*") {
        } else if (typeof type === "string") {
            return state$.sub("children", type);
        }
    }
    export function ctxmenu({ virtual = true, options = [] } = {}) {
        return function (e: MouseEvent) {
            e.preventDefault();
            menu.$set({
                reference: virtual ? e : (e.target as HTMLElement),
                options,
                rendered: true,
            });
        };
    }
    const rows: Record<string, HTMLTableRowElement> = {};
    $: expanded = {};
    $: hovered = {};
</script>

<div class="p-2">
    <table class="w-full">
        <slot name="caption" />
        <thead>
            <slot name="thead" />
        </thead>
        <tbody>
            <Tree
                bind:this={tree}
                state={root}
                {branchfunc}
                {resolvefunc}
                filterfunc={(item) => filterfunc(item) && item.type === type}
                verifyfunc={(item) =>
                    verifyfunc(item) &&
                    System.validator.validate(type || item.type, item)}
                {createMergeData}
                let:node
                let:value
                let:children
                let:id
            >
                {#if !node.isRoot}
                    <tr
                        data-id={id}
                        use:node.draggable
                        on:contextmenu={ctxmenu({
                            options: [
                                {
                                    label: "Log",
                                    show() {
                                        return true;
                                    },
                                    callback() {
                                        console.log(node);
                                    },
                                },
                                {
                                    label: "Make Container",
                                    show() {
                                        return !Array.isArray(
                                            node.children.value
                                        );
                                    },
                                    callback() {
                                        node.children.value = [];
                                    },
                                },
                                {
                                    label: "Undo Make Container",
                                    show() {
                                        return Array.isArray(
                                            node.children.value
                                        );
                                    },
                                    callback() {
                                        const parentNode =
                                            node.nodes[node.parentId];
                                        if (parentNode) {
                                            parentNode.children.value = [
                                                ...parentNode.children.value,
                                                ...node.children.value,
                                            ];
                                            const children = Object.assign(
                                                {},
                                                node.state.value.children
                                            );
                                            delete children[type];
                                            node.state.assign({
                                                children,
                                            });
                                        }
                                    },
                                },
                                {
                                    label: "Add Child",
                                    show() {
                                        return Array.isArray(
                                            node.children.value
                                        );
                                    },
                                    callback() {
                                        node.add();
                                    },
                                },
                                ...ctxoptions,
                                {
                                    label: "Edit",
                                    show() {
                                        return true;
                                    },
                                    callback() {
                                        const root = node.state.root;
                                        const resource = node.state;
                                        const uri = `/edit/${root.type}/${
                                            root.id
                                        }${
                                            resource.id !== root.id
                                                ? `/${resource.id}`
                                                : ""
                                        }`;
                                        window.open(
                                            window.origin + "/#" + uri,
                                            "editor",
                                            "width=700,height=700"
                                        );
                                    },
                                },
                                {
                                    label: "Delete",
                                    show() {
                                        return true;
                                    },
                                    callback: node.remove,
                                    class: "hover:bg-red-700 hover:text-white",
                                },
                            ],
                        })}
                        bind:this={rows[node.id]}
                        class="children:p-0 children:shadow even:bg-gray-100"
                    >
                        <td>
                            <i
                                on:click={(e) =>
                                    (expanded[node.id] = !expanded[node.id])}
                                class="fas fa-ellipsis-v text-xl hover:bg-red-700 hover:text-white p-1"
                            />
                            <Popper reference={rows[node.id]}>
                                {#if hovered[node.id]}
                                    <i class="fas fa-info-circle text-sm" />
                                    <slot name="toolbar" />
                                {/if}
                            </Popper>
                        </td>
                        <slot {node} {value} {children} {id} />
                        <td>
                            <i
                                on:click={(e) => node.remove()}
                                class="fas fa-trash hover:text-red-700 "
                            />
                        </td>
                    </tr>
                    {#if expanded[id]}
                        <tr>
                            <td use:colSpanMax>
                                <slot name="expanded" />
                            </td>
                        </tr>
                    {/if}
                {/if}
            </Tree>
        </tbody>
        <slot name="tfoot" />
    </table>
    <section class="border-b rounded-b border-red-700">
        <i
            on:click={(e) => tree.add()}
            class="p-1 fas fa-plus text-red-700 text-sm hover:bg-red-700 hover:text-white"
        />
    </section>
    <Menu bind:this={menu} />
</div>

<style lang="postcss">
    tr > :global(td > input) {
        @apply block w-full;
    }
</style>
