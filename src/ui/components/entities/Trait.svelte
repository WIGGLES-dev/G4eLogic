<script>
  import { getContext } from "svelte";
  import {} from "@ui/utils/formatting";
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
    {#if $entity.hasLevels}&nbsp;{$entity.levels}{/if}
  </td>
  <td>{$entity.adjustedPoints()}</td>
  <td>
    <Text bind:value={$entity.reference} />
  </td>
{:else if $display === 'grid'}
  <div
    data-offset
    data-column="name"
    data-main
    class="flex-1 pl-3 pl-{depth * 5}">
    {$entity.name}
    {#if $entity.hasLevels}&nbsp;{$entity.levels}{/if}
  </div>
  <div data-column="pts" class="w-1/12">{$entity.adjustedPoints()}</div>
  <div data-column="ref" class="w-1/12">{$entity.reference}</div>
{/if}
