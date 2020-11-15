<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { string } from "@ui/utils/formatting";
  export let i;
  export let depth;
  export let entity = {};
  $: ({ owner$, exists, id, disabled, hidden } = entity);
  export let display = "table";
  export let addItem = false;
  export let list = [];
  export let getRoot = (list) => list;
  export let accessChildren = () => [];
  export let contextMenuOptions = () => [];
  export let component = null;

  const { character, globalDispatch = createEventDispatcher() } =
    getContext("editor") || {};
</script>

<style>
  img {
    @apply h-3 m-auto;
  }
</style>

{#if display === 'table'}
  <td>{string(entity.owner.name)}</td>
  <td>{string(entity.usage)}</td>
  <td on:click={() => globalDispatch('roll', { entity, for: 'attack' })}>
    <div>
      <img src="sword-svgrepo-com.svg" alt="" />
      <span>{string(entity.getBestAttackLevel())}</span>
    </div>
  </td>
  <td>
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
    {string($owner$.name, {
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
