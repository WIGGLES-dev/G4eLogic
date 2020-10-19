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
  <td class="break-all">{entity.usage}</td>
  <td class="text-center">
    <div>
      <img src="sword-svgrepo-com.svg" alt="" />
      <span>{entity.getBestAttackLevel()}</span>
    </div>
  </td>
  <td class="text-center">
    <div>
      <img
        src="tai-chi-chuan-person-silhouette-with-a-fight-sword-svgrepo-com.svg"
        alt="" />
      <span>{entity.parry}</span>
    </div>
  </td>
  <td class="text-center">
    <div>
      <img src="shield-svgrepo-com.svg" alt="" /><span>{entity.block}</span>
    </div>
  </td>
  <td>{entity.info || ''}</td>
  <td>
    <span class="fas fa-dice-d6 pr-1" />{entity.damage}{entity.damageType}
  </td>
  <td>{entity.reach}</td>
  <td>{entity.strength}</td>
{:else if $display === 'list'}
  <li class="text-sm italic hover:underline">
    <div class="flex">
      <span>
        {entity.owner.name}
        -
        {entity.usage}
        ({entity.getBestAttackLevel()})
      </span>
      <!-- <div class="ml-auto"><span class="fas fa-dice-d6" /></div> -->
    </div>
  </li>
{/if}
