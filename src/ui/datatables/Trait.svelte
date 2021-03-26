<script context="module" lang="ts">
    import { fragment, bind } from "@utils/use";
    import DataTable from "@ui/DataTable.svelte";
    import Value from "@components/Value.svelte";
    import Leaf from "@components/Tree/Leaf.svelte";
    import Toggle from "@components/Toggle.svelte";
    import TraitEditor from "@ui/editors/TraitEditor.svelte";
</script>

<script lang="ts">
    import { System } from "@app/system";
    import { Observable, pipe } from "rxjs";
    import { mergeMap } from "rxjs/operators";
    import { withComlinkProxy } from "@app/utils/operators";
    import { State } from "rxdeep";
    import {
        Trait as TraitWorker,
        TraitData,
    } from "@app/gurps/resources/trait";
    import { map } from "rxjs/operators";
    export let root: State<any>;
    export let filterfunc;
    export let createMergeData: Record<string, any> = {};
    const Trait = System.getWorker<typeof TraitWorker>("trait");
    const makeTrait = pipe(withComlinkProxy((d) => new Trait(d, $root)));
</script>

<DataTable
    type="trait"
    {createMergeData}
    {root}
    {filterfunc}
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
    <td>
        <Value
            value={node.state.pipe(
                makeTrait,
                mergeMap((trait) => trait["getAdjustedPoints"]())
            )}
            let:value
        >
            {value}
        </Value>
    </td>
    <Leaf sub="reference" class="table-cell" />
    <template use:fragment slot="expanded">
        <TraitEditor entity={node.state} />
    </template>
</DataTable>

<style lang="postcss">
</style>
