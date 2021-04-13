<script context="module" lang="ts">
</script>

<script lang="ts">
    import Tree from "@components/Tree/Tree.svelte";
    import { getEditorContext } from "@ui/editors/Editor.svelte";
    import Menu from "@components/Menu/Menu.svelte";
    import { System, validateResource } from "@internal";
    export const defaults = {
        filterfunc(item) {
            return true;
        },
        verifyfunc(item) {
            return System.validate(item).valid;
        },
        resolvefunc(item, i, children) {
            return children?.sub(i).verified(validateResource);
        },
        branchfunc(state) {
            return state.sub("children");
        },
    };
    const { rootId$ } = getEditorContext();
    export let mergeData: Record<string, any> = {};
    export let disableDrag = false;
    export let disableDrop = false;
    export let maxDepth = Number.POSITIVE_INFINITY;
    export let appendable = true;
    export let showCollapsed = false;
    export let nestedStructure = false;
    export let filterfunc = defaults.filterfunc;
    export let verifyfunc = defaults.verifyfunc;
    export let resolvefunc = defaults.resolvefunc;
    export let branchfunc = defaults.branchfunc;
    $: treeSettings = {
        mergeData,
        disableDrag,
        disableDrop,
        maxDepth,
        appendable,
        showCollapsed,
        filterfunc,
        verifyfunc,
        resolvefunc,
        branchfunc,
    };
    export let root;
    export let type: string;
    export let ctxoptions = [];
    export let component = null;
    let tree: Tree;
    let menu: Menu;
    function edit(node) {
        const root = node.root.value;
        const resource = node.state.value;
        const uri = `/edit/${resource.type}/${$rootId$}${
            resource.id !== $rootId$ ? `/${resource.id}` : ""
        }`;
        const {
            innerWidth,
            innerHeight,
            screenLeft,
            screenTop,
            screen: { availWidth },
        } = window;
        const width = 1200;
        const height = 600;
        const zoom = width / availWidth;
        const features = `
            scrollbars=yes,
            width=${width},
            height=${height},
            left=${innerWidth / 2 - width / 2 + screenLeft},
            top=${innerHeight / 2 - height / 2 + screenTop}
        `;
        const editor = window.open(
            System.origin + "/#" + uri + "?hideMenu=true",
            resource.id,
            features
        );
        editor.focus();
        editor.onblur = (e) => editor.focus();
    }
    function ctxmenu(node) {
        const options = [
            {
                label: "Log",
                show: () => true,
                callback() {
                    console.log(node);
                },
            },
            {
                label: "Make Container",
                show: () =>
                    node?.state?.value?.isContainer !== true && nestedStructure,
                callback() {
                    node.state.assign({
                        isContainer: true,
                    });
                },
            },
            {
                label: "Undo Make Container",
                show: () =>
                    node?.state?.value?.isContainer === true && nestedStructure,
                callback() {
                    const parentNode = node.nodes[node.parentId];
                    if (parentNode) {
                        const pcv = parentNode.children.value;
                        const cv = node.children.value || [];
                        node.state.assign({ isContainer: false });
                        node.children.value =
                            node.children.value?.filter(
                                (d) => d.type !== type
                            ) ?? [];
                        parentNode.children.value = [
                            ...pcv,
                            ...cv.filter((d) => d.type === type),
                        ];
                    }
                },
            },
            {
                label: "Open Container",
                show: () =>
                    node.isContainer$.value === true &&
                    node.showingChildren$.value === false &&
                    nestedStructure,
                callback() {
                    node.showingChildren$.toggle();
                },
            },
            {
                label: "Close Container",
                show: () =>
                    node.isContainer$.value === true &&
                    node.showingChildren$.value === true &&
                    nestedStructure,
                callback() {
                    node.showingChildren$.toggle();
                },
            },
            {
                label: "Add Child",
                show: () => node.isContainer$.value === true && nestedStructure,
                callback() {
                    node.add();
                },
            },
            ...ctxoptions,
            {
                label: "Edit",
                show: () => true,
                callback() {
                    edit(node);
                },
            },
            {
                label: `Delete`,
                show: () => true,
                callback: () => node.remove(),
            },
        ];
        return function (e: MouseEvent) {
            menu.$set({
                reference: e,
                options,
                rendered: true,
            });
        };
    }
    function toggle() {}
</script>

<table>
    <slot name="caption" />
    <thead>
        <slot name="thead" />
    </thead>
    <tbody>
        <Tree
            bind:this={tree}
            state={root}
            {...treeSettings}
            filterfunc={(value) => filterfunc(value) && value.type === type}
            mergeData={{
                ...mergeData,
                rootId: root.value.id,
                type,
            }}
            let:node
            let:showing
            let:id
        >
            {#if showing}
                <tr
                    class:hidden={!showing}
                    data-id={id}
                    use:node.draggable
                    use:node.droppable
                    on:contextmenu|preventDefault={ctxmenu(node)}
                    class=" hover:bg-gray-100 even:bg-gray-100 children:border children:border-gray-500"
                >
                    {#if component}
                        <svelte:component this={component} {node} />
                    {:else}
                        <slot {node} {...node} />
                    {/if}
                </tr>
            {/if}
        </Tree>
    </tbody>
    <slot name="tfoot" />
</table>
<section class="border-b rounded-b border-red-700">
    {#if appendable}
        <i on:click={(e) => tree.add()} class=" fas fa-plus" />
        <i
            on:click={(e) => (showCollapsed = !showCollapsed)}
            class="fas fa-expand"
        />
    {/if}
</section>
<Menu bind:this={menu} />

<style lang="postcss">
    table {
        @apply text-sm;
    }
    .fas {
        @apply p-1 text-red-700 text-xs;
    }
    .fas:hover {
        @apply bg-red-700 text-white;
    }
</style>
