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
        <th>Weapons</th>
        <th>Usage</th>
        <th>Damage</th>
        <th>Lvl</th>
        {#if type === "melee weapon"}
            <th>Parry</th>
            <th>Block</th>
            <th>Reach</th>
        {:else if type === "ranged weapon"}
            <th>Acc</th>
            <th>Range</th>
            <th>Rof</th>
            <th>Shots</th>
            <th>Bulk</th>
            <th>Rcl</th>
        {/if}
        <th>ST</th>
        <th>Ref</th>
    </tr>
    <td>
        <span />
    </td>
    <Leaf sub="usage" class="table-cell" />
    <td>
        <input type="text" use:bind={node.state.sub("damage")} />
    </td>
    {#if type === "melee weapon"}
        <td>
            <input type="number" use:bind={node.state.sub("parry")} />
        </td>
        <td>
            <input type="number" use:bind={node.state.sub("block")} />
        </td>
        <td>
            <input type="string" use:bind={node.state.sub("reach")} />
        </td>
    {:else if type === "ranged weapon"}
        <td>
            <input type="text" use:bind={node.state.sub("parry")} />
        </td>
        <td>
            <input type="text" use:bind={node.state.sub("range")} />
        </td>
        <td>
            <input type="text" use:bind={node.state.sub("rof")} />
        </td>
        <td>
            <input type="text" use:bind={node.state.sub("shots")} />
        </td>
        <td>
            <input type="text" use:bind={node.state.sub("bulk")} />
        </td>
        <td>
            <input type="text" use:bind={node.state.sub("recoil")} />
        </td>
    {/if}
    <td>
        <input type="text" use:bind={node.state.sub("strength")} />
    </td>
    <Leaf sub="reference" class="table-cell" />
    <template slot="expanded" use:fragment>
        <svelte:component
            this={type === "melee"
                ? MeleeWeaponEditor
                : type === "ranged"
                ? RangedWeaponEditor
                : undefined}
            state$={node.state}
        />
    </template>
</DataTable>
