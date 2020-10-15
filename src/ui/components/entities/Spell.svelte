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
  <td>
    <div class="flex">
      <span class="h-full" style="padding-left:{depth * 2}rem;">&thinsp;</span>
      <span
        on:click={() => ($entity.isOpen = !$entity.isOpen)}
        class="fas"
        class:hidden={!$entity.isContainer()}
        class:fa-angle-right={!$entity.isOpen}
        class:fa-angle-down={$entity.isOpen} />
      <input class="flex-1" type="text" bind:value={$entity.name} />
    </div>
  </td>
  <td><input type="text" class="w-24" bind:value={$entity.resist} /></td>
  <td><input type="text" class="w-24" bind:value={$entity.class} /></td>
  <td><input type="text" class="w-24" bind:value={$entity.castingCost} /></td>
  <td>
    <input type="Text" class="w-24" bind:value={$entity.maintenanceCost} />
  </td>
  <td><input type="text" class="w-24" bind:value={$entity.castingTime} /></td>
  <td><input type="text" class="w-24" bind:value={$entity.duration} /></td>
  <td>{$entity.calculateLevel() || ''}</td>
  <td>{formatRSL($entity)}</td>
  <td>
    {#if !$entity.isContainer()}
      <input class="w-10" type="number" bind:value={$entity.points} />
    {/if}
  </td>
  <td><input class="w-12" type="text" bind:value={$entity.reference} /></td>
{/if}
