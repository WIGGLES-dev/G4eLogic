<script context="module" lang="ts">
    import DataTable from "@ui/DataTable.svelte";
    import { map } from "rxjs/operators";
    import { Character, fragment, bind } from "@internal";
    import SkillEditor from "@ui/editors/SkillEditor.svelte";
    import Leaf from "@components/Tree/Leaf.svelte";
    import Value from "@components/Value.svelte";
    import Toggle from "@components/Toggle.svelte";
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

<DataTable type="skill" root={character} let:node let:children>
    <tr slot="thead">
        <td />
        <th>Signature</th>
        <th>Difficulty</th>
        <th>Points</th>
        <th>Mod</th>
        <th>RSL</th>
        <th>Level</th>
        <th class="w-full">Skill</th>
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
            <option value="A" default>A</option>
            <option value="H">H</option>
            <option value="VH">VH</option>
            <option value="WC">WC</option>
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
            {Math.floor(value)}
        </Value>
    </td>
    <td>
        <Value value={node.state["level$"]} let:value>
            {Math.floor(value)}
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
    <Leaf sub="reference" class="table-cell" />
    <template slot="expanded" use:fragment>
        <SkillEditor entity={node.state} />
    </template>
</DataTable>

<style>
</style>
