<script context="module" lang="ts">
</script>

<script lang="ts">
    import { afterUpdate, onMount, tick } from "svelte";
    import Tree, { TreeNode } from "@components/Tree.svelte";
    import { fade } from "svelte/transition";
    import { getEditorContext } from "@app/ui/Editor.svelte";
    import { System, ScreenSize } from "@internal";
    import { State, state } from "rxdeep";
    import { maxCellCount } from "@utils/dom";
    const { rootId$, getEditor } = getEditorContext();
    import Hammer from "hammerjs";
    import Dialog from "@components/Dialog.svelte";
    import { fromEvent, Subscription } from "rxjs";
    import { delay, filter, tap } from "rxjs/operators";
    import TabPanel from "@app/components/Tabs/TabPanel.svelte";
    export let root: State<any>;
    export let type: string;
    export let ctxoptions = [];
    export let component = null;
    export let mergeData: Record<string, any> = {};
    export let disableDrag = false;
    export let disableDrop = false;
    export let maxDepth = Number.POSITIVE_INFINITY;
    export let appendable = true;
    export let showCollapsed = false;
    export let nestedStructure = false;
    export let columns: (string | [string, number])[] = [];
    export let hide: number[];
    export let selectedIds: string[] = [];
    export let focusedId: string;
    export let focused: boolean;
    export let locked: boolean = true;
    export let main = 0;
    let screenWidth: number;
    let tree: Tree;
    let tableElement: HTMLTableElement;
    let tableRows: number;
    afterUpdate(() => {
        const rows = tableElement.querySelectorAll("tbody tr");
        const newTableRows = Array.from(rows).length;
        if (newTableRows !== tableRows) {
            tableRows = newTableRows;
        }
    });
    let menu: Dialog;
    let dialog: Dialog;
    let tableMenu: Dialog;
    $: treeSettings = {
        mergeData,
        disableDrag,
        disableDrop,
        maxDepth,
        appendable,
        showCollapsed,
    };
    $: columnList =
        columns?.map((column): [string, number] => {
            if (column instanceof Array) {
                return column;
            } else {
                return [column, 1];
            }
        }) ?? [];
    $: if (tableElement && typeof tableRows === "number") {
        if (screenWidth < ScreenSize.S_LG) {
            const tableCells = maxCellCount(tableElement);
            hide = new Array(tableCells)
                .fill(undefined)
                .map((_, i) => i)
                .filter((v) => v !== main);
        } else {
            hide = [];
        }
    }
    $: if (
        tableElement &&
        typeof tableRows === "number" &&
        hide instanceof Array
    ) {
        const cells = tableElement.querySelectorAll("td,th");
        cells.forEach(
            (cell: HTMLTableCellElement | HTMLTableHeaderCellElement) => {
                const index = cell.cellIndex;
                if (index >= 0) {
                    if (hide.includes(index)) {
                        cell.style.display = "none";
                    } else {
                        cell.style.display = null;
                    }
                }
            }
        );
    }
    $: if (tableElement && typeof tableRows === "number") {
        const formControls = tableElement.querySelectorAll(
            `input,select,textarea,[contenteditable]`
        );
        if (locked === true) {
            formControls.forEach((control) => {
                if (control.hasAttribute("contenteditable")) {
                    control.setAttribute("contenteditable", "false");
                } else {
                    control.setAttribute("disabled", "true");
                }
            });
        } else if (locked === false) {
            formControls.forEach((control) => {
                if (control.hasAttribute("contenteditable")) {
                    control.setAttribute("contenteditable", "true");
                } else {
                    control.removeAttribute("disabled");
                }
            });
        }
    }
    async function openWindowEditor(node) {
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
            window.origin + "/#" + uri + "?hideMenu=true",
            resource.id,
            features
        );
        editor.focus();
        editor.onblur = (e) => editor.focus();
        return editor;
    }
    async function edit(node) {
        const resource = node.state.value;
        if (false && screenWidth > ScreenSize.S_LG) {
            openWindowEditor(node);
        } else {
            currentlyEditing = node.state;
            await tick();
            dialog.showModal();
        }
    }
    function toggle() {}
    function prune(node, i, nodeList) {
        return (
            node.value && node.value?.type === type && node?.showing === true
        );
    }
    function verify(item) {
        return System.validate(item).valid;
    }
    function onHeaderDrop(e: DragEvent) {
        const handlers = tree.handlers($root.id);
        return handlers.drop(e);
    }
    function handleKeyDown(e: KeyboardEvent) {
        if (!focused) return;
        const ids = Array.from(
            tableElement.querySelectorAll("tr[data-id]")
        ).map((element: HTMLTableRowElement) => element?.dataset?.id);
        const indexOfFocused = ids.indexOf(focusedId);
        const node = tree?.getNode(focusedId);
        const parentNode = tree?.getNode(node?.parentId);
        const focusedElem = !!tableElement.querySelector("*:focus");
        const nextId = ids[indexOfFocused + 1] || ids[0];
        const lastId = ids[indexOfFocused - 1] || ids[ids.length - 1];
        switch (e.key) {
            case "ArrowDown": {
                if (!focusedElem) {
                    focusedId = nextId;
                }
                break;
            }
            case "ArrowUp": {
                if (!focusedElem) {
                    focusedId = lastId;
                }
                break;
            }
            case "ArrowRight": {
                if (node?.isContainer === true) {
                    node.showingChildren$.set(true);
                }
                break;
            }
            case "ArrowLeft": {
                if (!focusedElem) {
                    if (node?.isContainer === true) {
                        node.showingChildren$.set(false);
                    }
                }
                break;
            }
            case "Delete": {
                if (!focusedElem) {
                    node?.remove();
                    focusedId = nextId;
                }
            }
            case "Enter": {
                if (!focusedElem) {
                    if (e.shiftKey) {
                        parentNode?.add();
                    } else if (e.ctrlKey) {
                        node.isContainer$.set(true);
                        node.add();
                    }
                }
            }
        }
    }
    function handleTouch(e: TouchEvent) {
        if (!focused) return;
        e.touches;
    }
    function checkForFocus(e: Event) {
        const target = e?.target as HTMLElement;
        focused = tableElement.contains(target);
    }
    onMount(() => {
        const subs = [] as Subscription[];
        function getNode(target: EventTarget) {
            if (target instanceof Element) {
                const id = target.closest<HTMLTableRowElement>("tr[data-id]")
                    ?.dataset?.id;
                return tree.getNode(id);
            }
        }
        function renderMenu(e: Event | HammerInput) {
            const node = getNode(e.target);
            if (node) {
                contextMenuNode = node;
                menu.showModal();
            }
        }
        function toggleViewChildren(e: HammerInput) {
            const node = getNode(e.target);
            if (node) {
                switch (e.direction) {
                    case Hammer.DIRECTION_LEFT: {
                        if (node.isContainer) {
                            node.showingChildren$.set(false);
                        }
                        break;
                    }
                    case Hammer.DIRECTION_RIGHT: {
                        if (node.isContainer) {
                            node.showingChildren$.set(true);
                        }
                        break;
                    }
                }
            }
        }
        const tableHeader = tableElement.querySelector("thead");
        const hammer = new Hammer(tableElement);
        const contextmenu$ = fromEvent(tableElement, "contextmenu");
        const dblclick$ = fromEvent(tableElement, "dblclick");
        const press$ = fromEvent<HammerInput>(hammer, "press");
        const tap$ = fromEvent<HammerInput>(hammer, "tap");
        const dbltap$ = fromEvent<HammerInput>(hammer, "doubletap");
        const swipe$ = fromEvent<HammerInput>(hammer, "swipe");
        const sub1 = contextmenu$
            .pipe(
                filter(() => screenWidth > ScreenSize.S_LG),
                tap((e) => e.preventDefault())
            )
            .subscribe(renderMenu);
        const sub2 = dbltap$
            .pipe(
                filter(() => screenWidth < ScreenSize.S_LG),
                delay(70)
            )
            .subscribe(renderMenu);
        const sub3 = swipe$.subscribe(toggleViewChildren);
        const sub4 = press$
            .pipe(
                filter(
                    (e) =>
                        e.target instanceof Element &&
                        tableHeader.contains(e.target)
                ),
                delay(70)
            )
            .subscribe(() => tableMenu.showModal());
        subs.push(sub1, sub2, sub3, sub4);
        return function () {
            subs.forEach((sub) => sub.unsubscribe);
            hammer.destroy();
        };
    });
    let contextMenuNode: TreeNode;
    let currentlyEditing: any;
    function closeEditorDialog() {
        currentlyEditing = false;
        dialog.close();
    }
    async function undoMakeContainer(node: TreeNode) {
        const { parentId } = node;
        const parentNode = tree.getNode(parentId);
        if (parentNode) {
            const nv =
                node.children$.value?.filter((c) => c?.type !== type) ?? [];
            const av =
                node.children$.value?.filter((c) => c?.type === type) ?? [];
            node.isContainer$.set(false);
            node.children$.value = [...nv];
            await tick();
            const pcv = parentNode.children$.value || [];
            tree.getNode(parentId).children$.value = [...pcv, ...av];
        }
    }
    let x;
</script>

<svelte:window
    bind:innerWidth={screenWidth}
    on:keydown={handleKeyDown}
    on:click={checkForFocus}
    on:touchend={handleTouch}
/>
<Dialog bind:this={menu} let:close>
    {#if contextMenuNode}
        <menu class="flex flex-col" on:click={close}>
            <button on:click={(e) => console.log(contextMenuNode)}>Log</button>
            {#if contextMenuNode.isContainer === false}
                <button
                    on:click={(e) => {
                        contextMenuNode.state.assign({
                            isContainer: true,
                        });
                    }}
                >
                    MakeContainer
                </button>
            {:else if contextMenuNode.isContainer === true && nestedStructure}
                <!-- <button on:click={(e) => undoMakeContainer(contextMenuNode)}>
                    Undo Make Container
                </button> -->
                {#if contextMenuNode.showingChildren === true}
                    <button
                        on:click={(e) =>
                            contextMenuNode.showingChildren$.set(false)}
                    >
                        Close Container
                    </button>
                {:else if contextMenuNode.showingChildren === false}
                    <button
                        on:click={(e) =>
                            contextMenuNode.showingChildren$.set(true)}
                    >
                        Open Container
                    </button>
                {/if}
                <button on:click={(e) => contextMenuNode.add()}
                    >Add Child</button
                >
            {/if}
            <button on:click={(e) => edit(contextMenuNode)}>Edit</button>
            <button
                on:click={(e) => contextMenuNode.remove()}
                class="bg-red-700 text-white"
            >
                Delete
            </button>
            <button>Close</button>
        </menu>
    {/if}
</Dialog>
<Dialog bind:this={dialog} class="w-screen h-screen overflow-auto bg-white p-0">
    {#if currentlyEditing}
        {#await getEditor(type) then editor}
            <svelte:component this={editor} entity={currentlyEditing} />
            <menu class="flex children:flex-1 sticky bottom-0">
                <button class="text-center" on:click={closeEditorDialog}>
                    Close
                </button>
            </menu>
        {/await}
    {/if}
</Dialog>
<Dialog bind:this={tableMenu} let:close>
    <menu on:click={close} class="flex flex-col children:p-3">
        {#if appendable}
            <i on:click={(e) => tree.add(root)} class=" fas fa-plus" />
        {/if}
        <i
            on:click={(e) => (showCollapsed = !showCollapsed)}
            class="fas fa-expand"
            class:uncollapsed={showCollapsed}
        />
        <i
            class="fas"
            class:fa-lock={locked}
            class:fa-unlock={!locked}
            on:click={(e) => (locked = !locked)}
        />
        <i class="fas fa-window-close" />
    </menu>
</Dialog>
<table class="data-table" bind:this={tableElement}>
    <colgroup>
        <slot name="colgroup">
            {#each columnList as [name, colspan], i (i)}
                <col class={name} {colspan} />
            {/each}
        </slot>
    </colgroup>
    <caption>
        <slot name="caption" />
    </caption>
    <thead
        on:drop={onHeaderDrop}
        on:dragover|preventDefault
        on:dragenter|preventDefault
    >
        <slot name="thead" />
    </thead>
    <tbody>
        <Tree
            bind:this={tree}
            {...treeSettings}
            tree={root}
            mergeData={{
                ...mergeData,
                rootId: root.value.id,
                type,
            }}
            {verify}
            {prune}
            let:node
        >
            <tr
                on:click={(e) => (focusedId = node.id)}
                class:selected={selectedIds instanceof Array &&
                    selectedIds.includes(node.id)}
                class:focused={focusedId === node.id}
                class:container={node.isContainer}
                data-id={node.id}
                use:node.draggable
                use:node.droppable
            >
                <svelte:component this={component} {node} />
            </tr>
        </Tree>
    </tbody>
    <tfoot>
        <slot name="tfoot" />
    </tfoot>
</table>

<style lang="postcss">
    table {
        @apply whitespace-nowrap;
    }
    thead :global(th) {
    }
    menu {
        @apply p-1 flex bg-white children:m-2;
    }
    table tr {
        @apply even:bg-gray-100 odd:bg-green-100 hover:bg-blue-100;
    }
    table tr.focused {
        @apply bg-blue-300;
    }
    table :global(th) {
        @apply text-white bg-gray-500;
    }
    table :global(td),
    table :global(th) {
        @apply border border-gray-500 border-solid px-1;
        height: 2rem;
    }
    table :global(input),
    table :global(select) {
        @apply bg-transparent;
    }
    .fas {
        @apply p-1 text-red-700 hover:bg-red-700 hover:text-white;
    }
    .uncollapsed {
        @apply bg-red-700 text-white;
    }
    .fas.fa-lock {
    }
    .fas.fa-unlock {
        @apply text-green-500 hover:text-white hover:bg-green-500;
    }
    table.collapse,
    table.collapse thead,
    table.collapse :global(tr),
    table.collase :global(td) {
        @apply block;
    }
    table.collapse > thead {
        @apply sticky;
    }
</style>
