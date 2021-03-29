<script context="module" lang="ts">
    import { fragment, bind } from "@utils/use";
    import DataTable from "@ui/DataTable.svelte";
    import Value from "@components/Value.svelte";
    import Leaf from "@components/Tree/Leaf.svelte";
    import { 
        RangedWeapon as RangedWeaponWorker,
        MeleeWeapon as MeleeWeaponWorker
    } from "@app/gurps/resources/weapon";
</script>

<script lang="ts">
    import { System } from "@internal";
    import { pipe } from "rxjs";
    import { State } from "rxdeep";
    import { withComlinkProxy } from "@utils/operators";
    import { mergeMap } from "rxjs/operators";
    export let root: State<any>;
    export let type: string;
    const RangedWeapon = System.getWorker<typeof RangedWeaponWorker>("ranged weapon");
    const MeleeWeapon = System.getWorker<typeof MeleeWeaponWorker>("melee weapon");
    const makeWeapon = pipe(
        withComlinkProxy((w) => {
            if (w["type"] === "melee weapon") {
                return new MeleeWeapon(null, null)
            } else if (w["type"] === "ranged weapon") {
                // return new RangedWeapon(null, null)
            }
        })
    );
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
        <Value
            value={node.state.pipe(
                makeWeapon,
                mergeMap(async w => {
                    
                })
            )}
        >

        </Value>
        <span></span>
    </td>
    <Leaf sub="usage" class="table-cell" />
    <td>
        <input type="text" use:bind={node.state.sub("damage")} />
    </td>
    <td>
        <Value 
            value={node.state.pipe(
            makeWeapon,
            mergeMap(w => w["getBestAttackLevel"]())
            )} 
            let:value
        >
            <output>{value}</output>
        </Value>
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
</DataTable>
