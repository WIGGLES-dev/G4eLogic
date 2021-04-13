<script lang="ts">
    import { getContext } from "svelte";
    import type { TreeNode } from "@components/Tree/Tree.svelte";
    import { fragment, bind } from "@utils/use";
    import { System } from "@app/system";
    import { Character } from "@internal";
    import { getEditorContext } from "@ui/editors/Editor.svelte";
    import { pluck } from "rxjs/operators";
    const { processed$ } = getEditorContext<Character>();
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id } = node);
    $: type = $state.type as "melee weapon" | "ranged weapon";
    $: isContainer = $isContainer$;
    $: showingChildren = $showingChildren$;
    $: embed = processed$.pipe(pluck("embedded", type, id));
    $: parentName = $embed?.parentData?.name;
    $: parentType = $embed?.parentData?.type;
    $: level = Math.floor($embed?.level);
    $: parryLevel = Math.floor(
        $embed && "parryLevel" in $embed && $embed.parryLevel
    );
    $: blockLevel = Math.floor(
        $embed && "blockLevel" in $embed && $embed.blockLevel
    );
</script>

{#if parentType !== "character"}
    <td>
        {#if parentName}
            {parentName}
        {/if}
    </td>
{:else if parentType}
    <td contenteditable="true" bind:textContent={$state.name} />
{/if}
<td contenteditable="true" bind:innerHTML={$state.usage} />
<td contenteditable="true" bind:textContent={$state.damage} />
<td
    class="w-2 rollable-cell"
    on:click={(e) => System.roll(`${$state.damage}`)}
/>
<td>
    <select bind:value={$state.damageType}>
        <option value="" default />
        <option value="cr">Cr</option>
        <option value="cut">Cut</option>
        <option value="imp">Imp</option>
        <option value="pi-">Pi-</option>
        <option value="pi-">Pi</option>
        <option value="pi+">Pi+</option>
        <option value="burn">Burn</option>
        <option value="fat">Fat</option>
        <option value="tox">Tox</option>
        <option value="cor">Cor</option>
        <option value="Special">Spc</option>
    </select>
</td>
<td class="rollable-cell">
    {#if level > 0}
        <output on:click={(e) => System.roll(`3d6${level}ms3d6`)}>
            {level}
        </output>
    {/if}
</td>
{#if $state.type === "melee weapon"}
    <td class="rollable-cell">
        {#if parryLevel > 0}
            <output on:click={(e) => System.roll(`3d6${parryLevel}ms3d6`)}>
                {parryLevel}
            </output>
        {/if}
    </td>
    <td class="rollable-cell">
        {#if blockLevel > 0}
            <output on:click={(e) => System.roll(`3d6${blockLevel}ms3d6`)}>
                {blockLevel}
            </output>
        {/if}
    </td>
    <td contenteditable="true" bind:textContent={$state.reach} />
{:else if $state.type === "ranged weapon"}
    <td contenteditable="true" bind:textContent={$state.accuracy} />
    <td contenteditable="true" bind:textContent={$state.range} />
    <td contenteditable="true" bind:textContent={$state.rateOfFire}> = </td>
    <td contenteditable="true" bind:textContent={$state.shots} />
    <td contenteditable="true" bind:textContent={$state.bulk} />
    <td contenteditable="true" bind:textContent={$state.recoil} />
{/if}
<td contenteditable="true" bind:textContent={$state.strengthRequirement} />
<td contenteditable="true" bind:textContent={$state.reference} />

<style lang="postcss">
</style>
