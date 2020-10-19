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
  <td>{string(entity.usage)}</td>
  <td>
    <div>
      <img src="sword-svgrepo-com.svg" alt="" />
      <span>{string(entity.getBestAttackLevel())}</span>
    </div>
  </td>
  <td>
    <span
      class="fas fa-dice-d6 pr-1" />{string(entity.damage, {
      afterEnd: ' ' + string(entity.damageType),
    })}
  </td>
  <td>{string(entity.accuracy)}</td>
  <td>{string(entity.range)}</td>
  <td>{string(entity.rateOfFire)}</td>
  <td>{string(entity.shots)}</td>
  <td>{string(entity.bulk)}</td>
  <td>{string(entity.recoil)}</td>
  <td>{string(entity.strength)}</td>
{:else if $display === 'list'}
  <li class="text-sm italic hover:underline">
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
  </li>
{/if}
