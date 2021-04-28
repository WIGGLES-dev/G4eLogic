<script lang="ts">
    import { afterUpdate } from "svelte";
    let tableElement: HTMLTableElement;
    export let hide: number[];
    export let locked = false;
    export let rows: number;
    function countTableRows() {
        if (tableElement) {
            rows = Array.from(tableElement.querySelectorAll("tbody>tr")).length;
        }
    }
    $: if (typeof rows === "number" && hide instanceof Array && tableElement) {
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
    $: if (tableElement) {
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
    afterUpdate(countTableRows);
</script>

<table bind:this={tableElement}>
    <caption>
        <slot name="caption" />
    </caption>
    <thead>
        <slot name="thead" />
    </thead>
    <slot name="tbody" />
    <tfoot>
        <slot name="tfoot" />
    </tfoot>
</table>

<style lang="postcss">
</style>
