<script>
  import { getContext } from "svelte";
  import { formatSkill, formatRSL } from "@ui/utils/formatting";
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";

  export let entity = null;
  export let depth;
  const { display, config } = getContext("list");

  $: invalidPoints = !pointsValid($entity.points);

  function pointsValid(points) {
    return points === 1 || points === 2 || points % 4 === 0;
  }
</script>

<style>
  .invalid {
    @apply text-white bg-red-700;
  }
</style>

{#if $display === 'table'}
  <td class="w-full">
    <span class="h-full" style="padding-left:{depth * 2}rem;">&thinsp;</span>
    <span
      on:click={() => ($entity.isOpen = !$entity.isOpen)}
      class="fas"
      class:hidden={!$entity.isContainer()}
      class:fa-angle-right={!$entity.isOpen}
      class:fa-angle-down={$entity.isOpen} />
    <input type="text" bind:value={$entity.name} />
    <!-- {#if $entity.hastechLevel}{`/TL${$entity.techLevel}`}{/if} -->
    {#if $entity.hasTechLevel}<input type="text" bind:value={$entity.techLevel}/>{/if}
    <!-- {#if $entity.specialization}&nbsp;{`(${$entity.specialization})`}{/if} -->
    {#if $entity.specialization} <input type="text" bind:value={$entity.specialization}>{/if}
  </td>
  <td class="text-center">{$entity.calculateLevel() || ''}</td>
  <td class="text-center">{formatRSL($entity)}</td>
  <td>
    {#if !$entity.isContainer()}
      <input
        class="text-center w-10"
        class:invalid={invalidPoints}
        type="number"
        bind:value={$entity.points} />
    {/if}
  </td>
  <td>
    <input class="w-10 text-center" type="number" bind:value={$entity.mod} />
  </td>
  <td><input class="w-12" type="text" bind:value={$entity.reference} /></td>
{/if}
