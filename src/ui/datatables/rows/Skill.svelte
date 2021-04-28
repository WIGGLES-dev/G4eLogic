<!-- <svelte:options immutable={true} /> -->
<script lang="ts">
    import { getContext } from "svelte";
    import type { TreeNode } from "@components/Tree.svelte";
    import Toggle from "@components/Toggle.svelte";
    import AttributeOptions from "@ui/options/AttributeOptions.svelte";
    import { System } from "@app/system";
    import { Character } from "@internal";
    import { pluck } from "rxjs/operators";
    import { getEditorContext } from "@app/ui/Editor.svelte";
    const { processed$ } = getEditorContext<Character>();
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id, indent } = node);
    $: type = $state.type as "skill" | "technique" | "spell";
    $: isContainer = $isContainer$;
    $: showingChildren = $showingChildren$;
    $: embed = processed$.pipe(pluck("embedded", type, id));
    $: level = Math.floor($embed && $embed.level);
    $: relativeLevel = Math.floor($embed && $embed.relativeLevel);

    $: name = state.sub("name");
    $: specialization = state.sub("specialization");
    $: signature = state.sub("signature");
    $: difficulty = state.sub("difficulty");
    $: points = state.sub("points");
    $: mod = state.sub("mod");
    $: resist = state.sub("resist");
    $: spellClass = state.sub("spellClass");
    $: castingCost = state.sub("castingCost");
    $: maintenanceCost = state.sub("mainenanceCost");
    $: castingTime = state.sub("castingTime");
    $: duration = state.sub("duration");
    $: reference = state.sub("reference");
</script>

<td style="padding-left:{indent * 8 + (isContainer ? 0 : 16)}px">
    <div class="flex">
        {#if isContainer}
            <Toggle
                bind:toggled={$showingChildren$}
                class="text-red-700 px-1"
            />
        {/if}
        <div contenteditable="true" class="flex-1" bind:textContent={$name} />
    </div>
</td>
{#if type === "skill"}
    <td contenteditable="true" bind:textContent={$specialization} />
{/if}
{#if type !== "technique"}
    <td>
        {#if !isContainer}
            <AttributeOptions
                signaturesOnly={true}
                bind:attribute={$signature}
            />
        {/if}
    </td>
{/if}
<td>
    {#if !isContainer}
        <select bind:value={$difficulty}>
            {#if type !== "technique"}
                <option value="E">E</option>
            {/if}
            <option value="A" default>A</option>
            <option value="H">H</option>
            {#if type !== "technique"}
                <option value="VH">VH</option>
                <option value="WC">WC</option>
            {/if}
        </select>
    {/if}
</td>
<td>
    {#if !isContainer}
        <input type="number" placeholder="0" bind:value={$points} />
    {/if}
</td>
<td>
    {#if !isContainer}
        <input type="number" placeholder="0" bind:value={$mod} />
    {/if}
</td>
{#if type !== "technique"}
    <td>
        {#if !isContainer && relativeLevel != null}
            <output>
                {relativeLevel}
            </output>
        {/if}
    </td>
{/if}
<td class:rollable-cell={!isContainer}>
    {#if !isContainer && level > 0}
        <output on:click|capture={(e) => System.roll(`3d6ms${level}`)}>
            {level}
        </output>
    {/if}
</td>
{#if type === "spell"}
    <td>
        <input type="text" bind:value={$resist} />
    </td>
    <td>
        <input type="text" bind:value={$spellClass} />
    </td>
    <td>
        <input type="text" bind:value={$castingCost} />
    </td>

    <td>
        <input type="text" bind:value={$maintenanceCost} />
    </td>
    <td>
        <input type="text" bind:value={$castingTime} />
    </td>
    <td>
        <input type="text" bind:value={$duration} />
    </td>
{/if}
<td contenteditable="true" bind:textContent={$reference} />

<style lang="postcss">
</style>
