<!-- <svelte:options immutable={true} /> -->
<script lang="ts">
    import { getContext } from "svelte";
    import type { TreeNode } from "@components/Tree/Tree.svelte";
    import Toggle from "@components/Toggle.svelte";
    import AttributeOptions from "@ui/options/AttributeOptions.svelte";
    import { System } from "@app/system";
    import { Character } from "@internal";
    import { pluck } from "rxjs/operators";
    import { getEditorContext } from "@ui/editors/Editor.svelte";
    const { processed$ } = getEditorContext<Character>();
    export let node: TreeNode;
    $: ({ isContainer$, showingChildren$, state, id } = node);
    $: type = $state.type as "skill" | "technique" | "spell";
    $: isContainer = $isContainer$;
    $: showingChildren = $showingChildren$;
    $: embed = processed$.pipe(pluck("embedded", type, id));
    $: level = Math.floor($embed && $embed.level);
    $: relativeLevel = Math.floor($embed && $embed.relativeLevel);
</script>

<td style="padding-left:{node.indent * 30 + 15}px">
    <div class="flex">
        {#if isContainer}
            <Toggle
                bind:toggled={$showingChildren$}
                class="text-red-700 px-1"
            />
        {/if}
        <input type="text" class="flex-1" bind:value={$state.name} />
    </div>
</td>
{#if type === "skill"}
    <td contenteditable="true" bind:textContent={$state.specialization} />
{/if}
{#if type === "skill"}
    <td>
        {#if !isContainer}
            <AttributeOptions
                signaturesOnly={true}
                bind:attribute={$state.signature}
            />
        {/if}
    </td>
{/if}
<td>
    {#if !isContainer}
        <select bind:value={$state.difficulty}>
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
        <input type="number" placeholder="0" bind:value={$state.points} />
    {/if}
</td>
<td>
    {#if !isContainer}
        <input type="number" placeholder="0" bind:value={$state.mod} />
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
        <output on:click={(e) => System.roll(`3d6ms${level}`)}>
            {level}
        </output>
    {/if}
</td>
{#if type === "spell"}
    <td>
        <input type="text" bind:value={$state.resist} />
    </td>
    <td>
        <input type="text" bind:value={$state.spellClass} />
    </td>
    <td>
        <input type="text" bind:value={$state.spellClass} />
    </td>

    <td>
        <input type="text" bind:value={$state.maintenanceCost} />
    </td>
    <td>
        <input type="text" bind:value={$state.castingTime} />
    </td>
    <td>
        <input type="text" bind:value={$state.duration} />
    </td>
{/if}
<td contenteditable="true" bind:textContent={$state.reference} />

<style lang="postcss">
</style>
