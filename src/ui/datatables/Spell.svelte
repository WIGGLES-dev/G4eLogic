<script context="module" lang="ts">
</script>

<script lang="ts">
    import { State } from "rxdeep";
    import { bind, fragment } from "@utils/use";
    import Leaf from "@components/Tree/Leaf.svelte";
    import Value from "@components/Value.svelte";
    import DataTable from "@ui/DataTable.svelte";
    import SpellEditor from "@ui/editors/SpellEditor.svelte";
    import Toggle from "@components/Toggle.svelte";
    import { System } from "@internal";
    import { pipe } from "rxjs";
    import { Spell as SpellWorker } from "@app/gurps/resources/spell";
    import { map, mergeMap } from "rxjs/operators";
    import { CharacterData } from "@app/gurps/resources/character";
    import AttributeOptions from "@ui/options/AttributeOptions.svelte";
    import { withComlinkProxy } from "@app/utils/operators";
    export let character: State<CharacterData>;
    const Spell = System.getWorker<typeof SpellWorker>("technique");
    const makeSpell = pipe(withComlinkProxy((d) => new Spell(d, $character)));
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
        <th>Resist</th>
        <th>Spell Class</th>
        <th> Casting Cost </th>
        <th>Maintenance Cost</th>
        <th>Casting Time</th>
        <th> Duration </th>
        <th>Reference</th>
    </tr>
    <td>
        <select use:bind={node.state.sub("signature")}>
            <AttributeOptions signaturesOnly={true} optionsOnly={true} />
        <select>
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
        <Value value={node.state.pipe(
            makeSpell,
            mergeMap(t => t["getRelativeLevel"]())
        )} let:value>
            {value}
        </Value>
    </td>
    <td>
        <Value value={node.state.pipe(
            makeSpell,
            mergeMap(t => t["getLevel"]())
        )} let:value>
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
    </td>
    <td>
        <input type="text" use:bind={node.state.sub("spellClass")} />
    </td>
    <td>
        <input type="text" use:bind={node.state.sub("castingCost")} />
    </td>

    <td>
        <input type="text" use:bind={node.state.sub("maintenanceCost")} />
    </td>
    <td>
        <input type="text" use:bind={node.state.sub("castingTime")} />
    </td>
    <td>
        <input type="text" use:bind={node.state.sub("duration")} />
    </td>
    <Leaf sub="reference" class="table-cell" />
    <template use:fragment slot="expanded">
        <SpellEditor entity={node.state} />
    </template>
</DataTable>

<style>
</style>
