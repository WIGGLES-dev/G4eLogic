<script context="module" lang="ts">
    import { Character, Equipment, Resolver, fragment, bind } from "@internal";
    import DataTable from "@ui/DataTable.svelte";
    import Value from "@components/Value.svelte";
    import Leaf from "@components/Tree/Leaf.svelte";
    import Toggle from "@components/Toggle.svelte";
    import TraitEditor from "@ui/editors/TraitEditor.svelte";
</script>

<script lang="ts">
    export let root: Character;
    export let filterfunc;
    export let createMergeData: Record<string, any> = {};
</script>

<DataTable
    type="trait"
    {root}
    {filterfunc}
    {createMergeData}
    let:node
    let:children
>
    <tr slot="thead">
        <td />
        <th class="w-full">
            <slot />
        </th>
        <th>Pts</th>
        <th>Reference</th>
    </tr>
    <td>
        <div class="flex" style="padding-left:{node.depth * 30}px">
            <Toggle
                visible={Array.isArray(children)}
                toggled={node.showingChildren}
                on:toggle={(e) =>
                    (node.showingChildren = !node.showingChildren)}
                class="text-red-700 pr-1"
            />
            <Leaf sub="name" class="flex-1" />
        </div>
    </td>
    <Value value={node.state["selectAdjustedPoints"]()} let:value>
        <td>{value}</td>
    </Value>
    <Leaf sub="reference" class="table-cell" />
    <template use:fragment slot="expanded">
        <TraitEditor entity={node.state} />
    </template>
</DataTable>

<style lang="postcss">
</style>
