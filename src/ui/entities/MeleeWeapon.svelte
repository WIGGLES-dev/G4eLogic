<script>
  import { getContext } from "svelte";
  import { string } from "@ui/utils/formatting";
  export let entity = null;

  const { display, config } = getContext("list");
  const { dispatch } = getContext("editor");
</script>

<style>
  img {
    @apply h-3 m-auto;
  }
</style>

{#if $display === 'table'}
  <td>{string($entity.owner.name)}</td>
  <td class="break-all">{string($entity.usage)}</td>
  <td
    class="text-center"
    on:click={() => dispatch('roll', { entity, for: 'attack' })}>
    <div>
      <img src="sword-svgrepo-com.svg" alt="" />
      <span>{string($entity.getBestAttackLevel())}</span>
    </div>
  </td>
  <td
    class="text-center"
    on:click={() => dispatch('roll', { entity, for: 'parry' })}>
    <div>
      <img
        src="tai-chi-chuan-person-silhouette-with-a-fight-sword-svgrepo-com.svg"
        alt="" />
      <span>{string($entity.getParryLevel(), { fallback: 'No' })}</span>
    </div>
  </td>
  <td
    class="text-center"
    on:click={() => dispatch('roll', { entity, for: 'block' })}>
    <div>
      <img
        src="shield-svgrepo-com.svg"
        alt="" /><span>{string($entity.getBlockLevel(), {
          fallback: 'No',
        })}</span>
    </div>
  </td>
  <td>{string($entity.info)}</td>
  <td on:click={() => dispatch('roll', { entity, for: 'damage' })}>
    <span class="fas fa-dice-d6 pr-1" />{string($entity.damage)}
    {string($entity.damageType)}
  </td>
  <td>{$entity.reach}</td>
  <td>{$entity.strength}</td>
{:else if $display === 'list'}
  <li class="text-sm italic hover:underline">
    <div class="flex">
      <span>
        {string($entity.owner.name, {
          afterEnd:
            ' - ' +
            string($entity.usage, {
              afterEnd: string($entity.getBestAttackLevel(), {
                beforeStart: ' (',
                afterEnd: ')',
              }),
            }),
        })}
      </span>
    </div>
  </li>
{/if}
