<script context="module" lang="ts">
</script>

<script lang="ts">
    import DataTable from "@ui/DataTable.svelte";
    import { State } from "rxdeep";
    import WeaponRow from "./rows/Weapon.svelte";
    export let character: State<any>;
    export let type: string;
    export let maxDepth = 1;
    export let disableDrag = false;
    export let disableDrop = false;
    export let appendable = true;
    export let showCollapsed = true;
</script>

<DataTable
    {showCollapsed}
    root={character}
    component={WeaponRow}
    {type}
    {maxDepth}
    {disableDrag}
    {disableDrop}
    {appendable}
    let:node
>
    <tr slot="thead">
        <th>Weapons</th>
        <th class="w-full">Usage</th>
        <th colspan="2">Damage</th>
        <th>Type</th>
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
</DataTable>
