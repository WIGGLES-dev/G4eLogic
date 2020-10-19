<script>
  import { getContext } from "svelte";
  import { formatSkill, formatRSL } from "@ui/utils/formatting";
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";
  export let entity = null;
  const { display, config } = getContext("list");
</script>

<style>
  img {
    @apply h-3 m-auto;
  }
</style>

{#if $display === 'table'}
  <td>{entity.owner.name}</td>
  <td>{entity.usage}</td>
  <td>
    <div>
      <img src="sword-svgrepo-com.svg" alt="" />
      <span>{entity.getBestAttackLevel()}</span>
    </div>
  </td>
  <td>
    <span class="fas fa-dice-d6 pr-1" />{entity.damage}{entity.damageType}
  </td>
  <td>{entity.accuracy}</td>
  <td>{entity.range}</td>
  <td>{entity.rateOfFire || ''}</td>
  <td>{entity.shots}</td>
  <td>{entity.bulk}</td>
  <td>{entity.recoil || ''}</td>
  <td>{entity.strength}</td>
{:else if $display === 'list'}
  <li class="text-sm italic hover:underline">
    {entity.owner.name}
    -
    {entity.usage}
    ({entity.getBestAttackLevel()})
  </li>
{/if}
