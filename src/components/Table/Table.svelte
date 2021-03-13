<script context="module" lang="ts">
    import { State } from "rxdeep";
    import { BehaviorSubject } from "rxjs";
    import { map, pluck } from "rxjs/operators";
    import { setContext, afterUpdate, createEventDispatcher } from "svelte";
    import { bind, arrayMove, fragment } from "@internal";
    import Menu, { MenuOption } from "@components/Menu/Menu.svelte";
    import Cell from "@components/Value.svelte";
    const components = {
        Cell,
        Menu,
    };
    const helpers = {
        bind,
        fragment,
        arrayMove,
    };
    function countTableColumns(table: HTMLTableElement) {
        const rows = table.querySelectorAll("tr");
        const rowColumns = Array.from(rows).map(countRowCells);
        return Math.max(...rowColumns);
    }
    function countRowCells(row: HTMLTableRowElement) {
        const cells = row.querySelectorAll("td");
        return Array.from(cells).reduce(sumCellSpan, 0);
    }
    function sumCellSpan(span: number, cell: HTMLTableCellElement) {
        const { colSpan } = cell;
        return colSpan + span;
    }
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();
    let table: HTMLTableElement;
    let contextmenu: Menu;
    let classList: string = "";
    export { classList as class };
    export const active$ = new State([]);
    export const columns$: State<number> = new State<number>(null as number);
    export const ctx = {
        getCtxMenu() {
            return contextmenu;
        },
        active$,
        columns$,
        setActive,
    };
    setContext("table", ctx);
    afterUpdate(() => (columns$.value = countTableColumns(table)));
    export function setActive(...ids: number[]) {
        active$.value = [...active$.value, ...ids];
    }
    function clickOnTable(e: MouseEvent) {
        const target = e.target as HTMLElement;
        return table.contains(target);
    }
    function clickOffTable(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (clickOnTable(e)) return;
        active$.value = [];
    }
</script>

<svelte:window on:click={clickOffTable} />
<table class="v-table {classList}" bind:this={table}>
    <slot {contextmenu} columns={$columns$} />
</table>
<Menu bind:this={contextmenu} />

<style lang="postcss">
    .v-table {
    }
    .v-table-menu {
        @apply p-0 m-0 border-b border-solid border-red-700 rounded-r flex;
    }
</style>
