<script context="module" lang="ts">
</script>

<script lang="ts">
    import { State } from "rxdeep";
    import DataTable from "@ui/DataTable.svelte";
    import { map, mergeMap, tap } from "rxjs/operators";
    import { fragment, bind } from "@utils/use";
    import SkillEditor from "@ui/editors/SkillEditor.svelte";
    import Leaf from "@components/Tree/Leaf.svelte";
    import Value from "@components/Value.svelte";
    import Toggle from "@components/Toggle.svelte";
    import { Character, CharacterData } from "@app/gurps/resources/character";
    import { System } from "@app/system";
    import { Skill as SkillWorker } from "@app/gurps/resources/skill";
    import { from, Observable, pipe, using } from "rxjs";
    import { withComlinkProxy } from "@app/utils/operators";
    import Dialog from "@components/Dialog.svelte";
    import AttributeOptions from "@ui/options/AttributeOptions.svelte";
    const Skill = System.getWorker<typeof SkillWorker>("skill");
    export let character: State<CharacterData>;
    const makeSkill = pipe(withComlinkProxy((d) => new Skill(d, $character)));
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
            <AttributeOptions signaturesOnly={true} optionsOnly={true} />
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
        <Value
            value={node.state.pipe(
                makeSkill,
                mergeMap((skill) => skill["getRelativeLevel"]())
            )}
            let:value
        >
            {Math.floor(value)}
        </Value>
    </td>
    <td class="bg-green-500 hover:bg-red-500">
        <Value
            value={node.state.pipe(
                makeSkill,
                mergeMap((skill) => skill["getLevel"]())
            )}
            let:value
        >
            <output
                class="block text-center p-0 bg-transparent text-white cursor-pointer"
                on:click={(e) => System.roll(`3d6ms${Math.floor(value)}`)}
            >
                {Math.floor(value)}
            </output>
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
