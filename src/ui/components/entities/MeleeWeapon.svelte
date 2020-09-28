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
  <td>
    <div class="table-cell-inner">{$entity.owner.name}</div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.usage}</div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.getBestAttackLevel()}</div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.block}</div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.parry}</div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.damage}</div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.reach}</div>
  </td>
  <td>
    <div class="table-cell-inner">{$entity.strength}</div>
  </td>
{/if}
