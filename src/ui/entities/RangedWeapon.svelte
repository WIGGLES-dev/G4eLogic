<script>
  import attackIco from "@ui/assets/sword-svgrepo-com.svg";

  import { getContext, createEventDispatcher } from "svelte";
  import { string } from "@ui/utils/formatting";
  export let entity = {};
  $: ({ bestAttackLevel$, owner$, exists, id, disabled, hidden } = entity);
  export let display = "table";

  const { character } = getContext("editor") || {};
</script>

<style>
  img {
    @apply h-3 m-auto;
  }
</style>

{#if display === 'table'}
  <td>{string(entity.owner.name)}</td>
  <td>{string(entity.usage)}</td>
  <td on:click={() => entity.executeAction('roll', { for: 'attack' })}>
    <div>
      <img src={attackIco} alt="" />
      <span>{string($bestAttackLevel$)}</span>
    </div>
  </td>
  <td
    class="cell-click"
    on:click={() => entity.executeAction('roll', { for: 'damage' })}>
    <span
      class="fas fa-dice-d6 pr-1" />{string($entity.damage, {
      afterEnd: ' ' + string($entity.damageType),
    })}
  </td>
  <td>{string($entity.accuracy)}</td>
  <td>{string($entity.range)}</td>
  <td>{string($entity.rateOfFire)}</td>
  <td>{string($entity.shots)}</td>
  <td>{string($entity.bulk)}</td>
  <td>{string($entity.recoil)}</td>
  <td>{string($entity.strength)}</td>
{:else if display === 'list'}
  <li class="text-sm italic hover:underline">
    {string($owner$.keys.name, {
      afterEnd:
        ' - ' +
        string($entity.usage, {
          afterEnd: string($bestAttackLevel$, {
            beforeStart: ' (',
            afterEnd: ')',
          }),
        }),
    })}
  </li>
{/if}
