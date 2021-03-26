<script context="module" lang="ts">
    import { fragment, bind } from "@utils/use";
    import DataTable from "@ui/DataTable.svelte";
    import Value from "@components/Value.svelte";
    import Leaf from "@components/Tree/Leaf.svelte";
    import MeleeWeaponEditor from "@ui/editors/MeleeWeaponEditor.svelte";
    import RangedWeaponEditor from "@ui/editors/RangedWeaponEditor.svelte";
</script>

<script lang="ts">
    export let root;
    export let type: string;
</script>

<DataTable {root} {type} let:node>
    <tr slot="thead">
        <td />
        <th>Enabled</th>
        <th>Modifier</th>
        <th>Cost Modifier</th>
        <th>Ref</th>
    </tr>
    <td>
        <input
            type="checkbox"
            use:bind={node.state.sub("metadata", "enabled")}
        />
    </td>
    <Leaf sub="name" />
    <td>
        <!-- Cost Modifier -->
    </td>
    <Leaf sub="reference" class="table-cell" />
    <template slot="expanded" use:fragment>
        <!-- Editor -->
    </template>
</DataTable>
