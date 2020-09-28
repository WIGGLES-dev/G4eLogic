<script>
  import { getContext } from "svelte";
  import { formatSkill, formatRSL } from "@ui/utils/formatting";
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";
  export let entity = null;
  const { display, config } = getContext("list");
</script>

<style>
</style>

{#if $display === 'table'}
  <td class="main-col">
    <div
      style="padding-left:{$entity.getItemDepth() * 20 + 10}px;"
      class="table-cell-inner">
      <Text bind:value={$entity.name} />
      {#if $entity.techLevel}{`/TL${$entity.techLevel}`}{/if}
      {#if $entity.specialization}&nbsp;{`(${$entity.specialization})`}{/if}
    </div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.calculateLevel()}</div>
  </td>
  <td>
    <div class="table-cell-inner">{formatRSL($entity)}</div>
  </td>
  <td>
    <div class="table-cell-inner">
      <Number bind:value={$entity.points} />
    </div>
  </td>
  <td>
    <div class="table-cell-inner">
      <Text bind:value={$entity.reference} />
    </div>
  </td>
{/if}
