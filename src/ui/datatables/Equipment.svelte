<script context="module" lang="ts">
    import { Character, Equipment, Resolver, fragment, bind } from "@internal";
    import DataTable from "@ui/DataTable.svelte";
    import Value from "@components/Value.svelte";
    import Leaf from "@components/Tree/Leaf.svelte";
    import Toggle from "@components/Toggle.svelte";
    import EquipmentEditor from "@ui/editors/EquipmentEditor.svelte";
</script>

<script lang="ts">
    export let character: Character;
    const filter$ = character.sub("metadata", "flags", "equipmentFilter");
    function filterfunc(item: Equipment["value"]) {
        if ($filter$ && typeof item?.location === "string") {
            return $filter$ === item.location;
        } else {
            return true;
        }
    }
</script>

<DataTable type="equipment" root={character} let:node let:children>
    <tr slot="thead">
        <td />
        <th>E</th>
        <th>
            <span class="px-2">#</span>
        </th>
        <th class="w-full">
            Equipment
            <select bind:value={$filter$}>
                <option value="carried">Carried</option>
                <option value="other">Other</option>
            </select>
        </th>
        <th>Uses</th>
        <th>Value</th>
        <th>Weight</th>
        <th>EValue</th>
        <th>EWeight</th>
        <th>Location</th>
        <th>Reference</th>
    </tr>
    <td>
        <input
            type="checkbox"
            use:bind={node.state.sub("metadata", "enabled")}
        />
    </td>
    <td>
        <input type="number" use:bind={node.state.sub("quantity")} />
    </td>
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
        <input type="number" use:bind={node.state.sub("uses")} />
    </td>
    <td>
        <input type="number" use:bind={node.state.sub("value")} />
    </td>
    <td>
        <input type="number" use:bind={node.state.sub("weight")} />
    </td>
    <td>
        <Value value={node.state["selectExtendedValue"]()} let:value>
            {+value.toFixed(3)}
        </Value>
    </td>
    <td>
        <Value value={node.state["selectExtendedWeight"]()} let:value>
            {+value.toFixed(3)}
        </Value>
    </td>

    <td>
        <select use:bind={node.state.sub("location")}>
            <option default value={undefined}>Select A Location</option>
            <option value="carried">Carried</option>
            <option value="other">Other</option>
        </select>
    </td>
    <Leaf sub="reference" class="table-cell" />
    <template use:fragment slot="expanded">
        <EquipmentEditor entity={node.state} />
    </template>
</DataTable>

<style lang="postcss">
    input,
    textarea {
        @apply block w-full;
    }
</style>
