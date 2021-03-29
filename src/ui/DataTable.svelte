<script context="module" lang="ts">
    import { State } from "rxdeep";
    import { fragment, lift, colSpanMax } from "@utils/use";
    import { push } from "svelte-spa-router";
    import Tree, { TreeNode } from "@components/Tree/Tree.svelte";
    import Popper from "@components/Popper.svelte";
    import Menu from "@components/Menu/Menu.svelte";
    import { System, validateResource } from "@internal";
</script>

<script lang="ts">
    export let root;
    export let type: string;
    export let ctxoptions = [];
    export let filterfunc: Tree["$$prop_def"]["filterfunc"] = (item) => true;
    export let verifyfunc: Tree["$$prop_def"]["verifyfunc"] = (item) =>
        item && item.type === type && System.validator.validate(type, item);
    export let createMergeData: Record<string, any> = {};
    let tree: Tree;
    export let menu: Menu;
    function resolvefunc(item: any, i: any, children: State<any[]>) {
        return children?.sub(i).verified(validateResource);
    }
    function branchfunc(state$) {
        return state$.sub("children", type);
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
    function edit(node) {
        const root = node.root.value;
        const resource = node.state.value;
        const uri = `/edit/${resource.type}/${root.id}${
            resource.id !== root.id ? `/${resource.id}` : ""
        }`;
        const { width, height } = window.screen;
        const features = `
            width=${width / 2},
            height=${height / 2},
            left=${width / 4},
            top=${height / 4}
        `;
        const editor = window.open(
            System.origin + "/#" + uri + "?hideMenu=true",
            "editor",
            features
        );
        editor.focus();
        editor.onblur = (e) => editor.focus();
    }
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
                {verifyfunc}
                createMergeData={{
                    ...createMergeData,
                    rootId: root.value.id,
                    type,
                }}
                let:node
                let:value
                let:children
                let:id
            >
                {#if !node.isRoot && filterfunc(value) && value.type === type}
                    <tr
                        data-id={id}
                        use:node.draggable
                        use:node.droppable
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
                                        edit(node);
                                    },
                                },
                                {
                                    label: `Delete`,
                                    show() {
                                        return true;
                                    },
                                    callback: node.remove,
                                },
                            ],
                        })}
                        class="children:p-0 children:shadow even:bg-gray-100"
                    >
                        <td>
                            <i
                                on:click={(e) => edit(node)}
                                class="fas fa-ellipsis-v text-xl hover:bg-red-700 hover:text-white p-1"
                            />
                        </td>
                        <slot {node} {value} {children} {id} />
                        <td>
                            <i
                                on:click={(e) => node.remove()}
                                class="fas fa-trash hover:text-red-700"
                            />
                        </td>
                    </tr>
                    {#if false}
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
