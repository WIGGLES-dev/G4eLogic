<script context="module" lang="ts">
    import { Observable, isObservable } from "rxjs";
    import { reduce, map } from "rxjs/operators";
    export function frappeReduce(row) {

    }
    export function frappeReduceStream(keymap) {
        return function(src: Observable<any[]>): Observable<any[]> {
            let indent = 0;
            return src.pipe(
                map(i => {
                    
                }),
                reduce((data, row) => {
                    if (isObservable(row)) {

                    } else {

                    }
                    const newRow = {
                        indent
                    }
                    indent++;
                    return [
                        ...data,
                        newRow
                    ]
                }, [])
            )
        }
    }
</script>
<script>
    import DataTable from "frappe-datatable";
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    let element;
    export let columns = []
    export let data = [];
    $: DataTable.refresh(data)
    export let getEditor;
    export let serialNoColumn
    export let checkboxColumn
    export let clusterize
    export let layout
    export let noDataMessage;
    export let dynamicRowHeight;
    export let cellHeight;
    export let inlineFilters;
    export let treeView;
    export let checkedRowStatus;
    export let pasteFromClipboard;
    export let dropdownButtons;
    export let headerDropdown;
    const events = {
        onRemoveColumn(c) {
            dispatch("onRemoveColumn", c)
        },
        onSwitchColumn(c1, c2) {
            dispatch("onSwitchColumn", [c1, c2])
        },
        onSortColumn(c) {
            dispatch("onSortColumn", c)
        },
        oncheckRow(r) {
            dispatch("onCheckRow", r)
        }
    };
    export const DT = new DataTable(element, {
        columns,
        data,
        getEditor,
        serialNoColumn,
        checkboxColumn,
        clusterize,
        layout,
        noDataMessage,
        dynamicRowHeight,
        cellHeight,
        inlineFilters,
        treeView,
        checkedRowStatus,
        pasteFromClipboard,
        dropdownButtons,
        headerDropdown,
        events
    });
</script>

<style>

</style>

<div bind:this={element}>

</div>