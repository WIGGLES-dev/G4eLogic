<script context="module" lang="ts">
    import { fragment, bind } from "@utils/use";
    import DataTable from "@ui/DataTable.svelte";
    import Leaf from "@components/Tree/Leaf.svelte";
</script>

<script lang="ts">
    export let root;
    export let type: string;
</script>

<DataTable {root} {type} let:node>
    <tr slot="thead">
        <td />
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
    <td>
        <input
            type="checkbox"
            use:bind={node.state.sub("metadata", "enabled")}
        />
    </td>
    <Leaf sub="name" class="table-cell"/>
    {#if type === "equipment modifier"}
        <td>
            <!--  -->
        </td>    
        <td>
            <!--  -->
        </td> 
    {:else if type === "trait modifier"}
        <td>
            <!--  -->
        </td>
    {/if}
    <td>
        <!-- Cost Modifier -->
    </td>
    <Leaf sub="reference" class="table-cell" />
    <template slot="expanded" use:fragment>
        <!-- Editor -->
    </template>
</DataTable>