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
  <td>{$entity.owner.name}</td>
  <td>{$entity.usage}</td>
  <td>{$entity.getBestAttackLevel()}</td>
  <td>{$entity.accuracy}</td>
  <td>{$entity.damage}</td>
  <td>{$entity.range}</td>
  <td>{$entity.rateOfFire}</td>
  <td>{$entity.shots}</td>
  <td>{$entity.bulk}</td>
  <td>{$entity.recoil}</td>
  <td>{$entity.strength}</td>
{:else if $display === 'list'}
  <li class="text-sm italic hover:underline">{$entity.owner.name}</li>
{/if}
