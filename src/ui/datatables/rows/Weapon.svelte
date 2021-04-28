<script lang="ts">
    import { getContext } from "svelte";
    import type { TreeNode } from "@components/Tree.svelte";
    import { fragment, bind } from "@utils/use";
    import { System } from "@app/system";
    import { Character } from "@internal";
    import { getEditorContext } from "@app/ui/Editor.svelte";
    import { pluck } from "rxjs/operators";
    import { range } from "rxjs";
    const { processed$ } = getEditorContext<Character>();
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id } = node);

    $: type = $state.type as "melee weapon" | "ranged weapon";
    $: isContainer = $isContainer$;
    $: showingChildren = $showingChildren$;

    $: name = state.sub("name");
    $: usage = state.sub("usage");
    $: damage = state.sub("damage");
    $: damageType = state.sub("damageType");
    $: reach = state.sub("reach");
    $: accuracy = state.sub("accuracy");
    $: weaponRange = state.sub("range");
    $: rateOfFire = state.sub("rateOfFire");
    $: shots = state.sub("shots");
    $: bulk = state.sub("bulk");
    $: recoil = state.sub("recoil");
    $: strengthRequirement = state.sub("strengthRequirement");
    $: reference = state.sub("reference");

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
    <td contenteditable="true" bind:textContent={$name} />
{/if}
<td contenteditable="true" bind:innerHTML={$usage} />
<td
    contenteditable="true"
    bind:textContent={$damage}
    on:contextmenu|stopPropagation|preventDefault={(e) => System.roll($damage)}
/>
<td>
    <select bind:value={$damageType}>
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
        <output on:click={(e) => System.roll(`3d6ms${level}`)}>
            {level}
        </output>
    {/if}
</td>
{#if $state.type === "melee weapon"}
    <td class="rollable-cell">
        {#if parryLevel > 0}
            <output on:click={(e) => System.roll(`3d6ms${parryLevel}`)}>
                {parryLevel}
            </output>
        {/if}
    </td>
    <td class="rollable-cell">
        {#if blockLevel > 0}
            <output on:click={(e) => System.roll(`3d6ms${blockLevel}`)}>
                {blockLevel}
            </output>
        {/if}
    </td>
    <td contenteditable="true" bind:textContent={$reach} />
{:else if $state.type === "ranged weapon"}
    <td contenteditable="true" bind:textContent={$accuracy} />
    <td contenteditable="true" bind:textContent={$weaponRange} />
    <td contenteditable="true" bind:textContent={$rateOfFire} />
    <td contenteditable="true" bind:textContent={$shots} />
    <td contenteditable="true" bind:textContent={$bulk} />
    <td contenteditable="true" bind:textContent={$recoil} />
{/if}
<td contenteditable="true" bind:textContent={$strengthRequirement} />
<td contenteditable="true" bind:textContent={$reference} />

<style lang="postcss">
</style>
