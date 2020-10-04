<script>
  import { getContext } from "svelte";
  import { formatSkill, formatRSL } from "@ui/utils/formatting";
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";

  export let entity = null;
  export let depth;
  const { display, config } = getContext("list");
</script>

<style>
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
    <Text bind:value={$entity.name} />
  </td>
  <td>
    <Text bind:value={$entity.resist} />
  </td>
  <td>
    <Text bind:value={$entity.class} />
  </td>
  <td>
    <Text bind:value={$entity.castingCost} />
  </td>
  <td>
    <Text bind:value={$entity.maintenanceCost} />
  </td>
  <td>
    <Text bind:value={$entity.castingTime} />
  </td>
  <td>
    <Text bind:value={$entity.duration} />
  </td>
  <td>{$entity.calculateLevel() || ''}</td>
  <td>{formatRSL($entity)}</td>
  <td>
    {#if !$entity.isContainer()}
      <Number bind:value={$entity.points} />
    {/if}
  </td>
  <td>
    <Text bind:value={$entity.reference} />
  </td>
{/if}
