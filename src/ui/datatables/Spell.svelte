<script context="module" lang="ts">
    import { Spell, Character, bind, fragment } from "@internal";
    import Leaf from "@components/Tree/Leaf.svelte";
    import Value from "@components/Value.svelte";
    import DataTable from "@ui/DataTable.svelte";
    import SpellEditor from "@ui/editors/SpellEditor.svelte";
    import Toggle from "@components/Toggle.svelte";
    import { map } from "rxjs/operators";
</script>

<script lang="ts">
    export let character: Character;
    const signatureOptions$ = character.sub("config", "attributes").pipe(
        map((attributes) => Object.entries(attributes || {})),
        map((attributes) =>
            attributes.filter(([key, value]) => value.skillSignature)
        ),
        map((attributes) =>
            attributes.map(([value, attr]) => ({
                value,
                label: attr.abbreviation || value,
            }))
        )
    );
</script>

<DataTable type="spell" root={character} let:node let:children>
    <tr slot="thead">
        <td />
        <th>Signature</th>
        <th>Difficulty</th>
        <th>Points</th>
        <th>Mod</th>
        <th>RSL</th>
        <th>Level</th>
        <th class="w-full">Spell</th>
        <th>
            <div>Resist</div>
            <div>Spell Class</div>
        </th>
        <th>
            <div>Casting Cost</div>
            <div>Maintenance Cost</div>
        </th>
        <th>
            <div>Casting Time</div>
            <div>Duration</div>
        </th>
        <th>Reference</th>
    </tr>
    <td>
        <select use:bind={node.state.sub("signature")}>
            {#each $signatureOptions$ as { value, label }, i (i)}
                <option {value}>{label}</option>
            {/each}
        </select>
    </td>
    <td>
        <select use:bind={node.state.sub("difficulty")}>
            <option value="E">E</option>
            <option value="A">A</option>
            <option value="H">H</option>
            <option value="VH">VH</option>
            <option value="W">WC</option>
        </select>
    </td>
    <td>
        <input type="number" use:bind={node.state.sub("points")} />
    </td>
    <td>
        <input type="number" use:bind={node.state.sub("mod")} />
    </td>
    <td>
        <Value value={node.state["relativeLevel$"]} let:value>
            {value}
        </Value>
    </td>
    <td>
        <Value value={node.state["level$"]} let:value>
            {value}
        </Value>
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
        <input type="text" use:bind={node.state.sub("resist")} />
        <input type="text" use:bind={node.state.sub("spellClass")} />
    </td>
    <td>
        <input type="text" use:bind={node.state.sub("castingCost")} />
        <input type="text" use:bind={node.state.sub("maintenanceCost")} />
    </td>
    <td>
        <input type="text" use:bind={node.state.sub("castingTime")} />
        <input type="text" use:bind={node.state.sub("duration")} />
    </td>
    <Leaf sub="reference" />
    <template use:fragment slot="expanded">
        <SpellEditor entity={node.state} />
    </template>
</DataTable>

<style>
</style>
