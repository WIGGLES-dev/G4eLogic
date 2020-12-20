<script lang="ts">
  import { string, Valor, RangedWeapon } from "@internal";
  const { attackIco } = Valor.assets;
  export let entity = {} as RangedWeapon;
  $: ({ bestAttackLevel$, parent$, exists, id, disabled, hidden } = entity);
  export let display = "table";
</script>

<style>
  img {
    @apply h-3 m-auto;
  }
</style>

{#if display === 'table'}
  <td>{string($parent$.keys.name)}</td>
  <td>{string($entity.usage)}</td>
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
  <td>{string($entity.strengthRequirement)}</td>
{:else if display === 'list'}
  <li class="text-sm italic hover:underline">
    {string($parent$.keys.name, {
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
