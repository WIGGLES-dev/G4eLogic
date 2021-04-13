<script context="module" lang="ts">
    import DataTable from "@ui/DataTable.svelte";
    import ModifierRow from "./rows/Modifier.svelte";
</script>

<script lang="ts">
    export let root;
    export let type: string;
</script>

<DataTable {root} {type} component={ModifierRow}>
    <tr slot="thead">
        <th>Enabled</th>
        <th class="w-full">Modifier</th>
        {#if type === "equipment modifier"}
            <th>Cost Adjustment</th>
            <th>Weight Adjustment</th>
        {:else if type === "trait modifier"}
            <th>Cost Modifier</th>
        {/if}
        <th>Ref</th>
    </tr>
</DataTable>
