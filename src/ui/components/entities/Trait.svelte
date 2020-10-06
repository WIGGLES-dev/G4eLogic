<script>
  import { getContext } from "svelte";
  import {} from "@ui/utils/formatting";
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";

  export let entity = null;
  export let depth;
  const { display, config } = getContext("list");
</script>

<style>
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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
    <input
      type="text"
      class="w-1/2 truncate border-b border-solid border-black"
      bind:value={$entity.name} />
  </td>
  <td>
    <input
      type="number"
      class="w-10 text-center"
      bind:value={$entity.levels}
      disabled={!$entity.hasLevels} />
  </td>
  <td class="text-center">{$entity.adjustedPoints()}</td>
  <td>
    <input
      class="w-10 text-center truncate border-b border-solid border-black"
      type="text"
      bind:value={$entity.reference} />
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
