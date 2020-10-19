<script>
  import { getContext } from "svelte";
  import { string } from "@ui/utils/formatting";
  export let entity = null;
  const { display, config } = getContext("list");
</script>

<style>
  img {
    @apply h-3 m-auto;
  }
</style>

{#if $display === 'table'}
  <td>{string(entity.owner.name)}</td>
  <td class="break-all">{string(entity.usage)}</td>
  <td class="text-center">
    <div>
      <img src="sword-svgrepo-com.svg" alt="" />
      <span>{string(entity.getBestAttackLevel())}</span>
    </div>
  </td>
  <td class="text-center">
    <div>
      <img
        src="tai-chi-chuan-person-silhouette-with-a-fight-sword-svgrepo-com.svg"
        alt="" />
      <span>{string(entity.parry)}</span>
    </div>
  </td>
  <td class="text-center">
    <div>
      <img
        src="shield-svgrepo-com.svg"
        alt="" /><span>{string(entity.block)}</span>
    </div>
  </td>
  <td>{string(entity.info)}</td>
  <td>
    <span
      class="fas fa-dice-d6 pr-1" />{string(entity.damage)}{string(entity.damageType)}
  </td>
  <td>{entity.reach}</td>
  <td>{entity.strength}</td>
{:else if $display === 'list'}
  <li class="text-sm italic hover:underline">
    <div class="flex">
      <span>
        {string(entity.owner.name, {
          afterEnd:
            ' - ' +
            string(entity.usage, {
              afterEnd: string(entity.getBestAttackLevel(), {
                beforeStart: ' (',
                afterEnd: ')',
              }),
            }),
        })}
      </span>
      <!-- <div class="ml-auto"><span class="fas fa-dice-d6" /></div> -->
    </div>
  </li>
{/if}
