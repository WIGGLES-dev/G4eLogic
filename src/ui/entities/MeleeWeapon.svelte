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

{#if exists}
  {#if display === 'table'}
    <td>{string($owner$.keys.name)}</td>
    <td class="break-all">{string($entity.usage)}</td>
    <td
      class="text-center"
      on:click={() => globalDispatch('roll', { entity, for: 'attack' })}>
      <div>
        <img src="sword-svgrepo-com.svg" alt="" />
        <span>{string(entity.getBestAttackLevel())}</span>
      </div>
    </td>
    <td
      class="text-center"
      on:click={() => globalDispatch('roll', { entity, for: 'parry' })}>
      <div>
        <img
          src="tai-chi-chuan-person-silhouette-with-a-fight-sword-svgrepo-com.svg"
          alt="" />
        <span>{string(entity.getParryLevel(), { fallback: 'No' })}</span>
      </div>
    </td>
    <td
      class="text-center"
      on:click={() => globalDispatch('roll', { entity, for: 'block' })}>
      <div>
        <img
          src="shield-svgrepo-com.svg"
          alt="" /><span>{string(entity.getBlockLevel(), {
            fallback: 'No',
          })}</span>
      </div>
    </td>
    <td>{string($entity.info)}</td>
    <td on:click={() => globalDispatch('roll', { entity, for: 'damage' })}>
      <span class="fas fa-dice-d6 pr-1" />{string($entity.damage)}
      {string($entity.damageType)}
    </td>
    <td>{$entity.reach}</td>
    <td>{$entity.strength}</td>
  {:else if display === 'list'}
    <li class="text-sm italic hover:underline">
      <div class="flex">
        <span>
          {string($owner$.name, {
            afterEnd:
              ' - ' +
              string($entity.usage, {
                afterEnd: string(entity.getBestAttackLevel(), {
                  beforeStart: ' (',
                  afterEnd: ')',
                }),
              }),
          })}
        </span>
      </div>
    </li>
  {/if}
{/if}
