<script>
  import attackIco from "@ui/assets/sword-svgrepo-com.svg";
  import parryIco from "@ui/assets/tai-chi-chuan-person-silhouette-with-a-fight-sword-svgrepo-com.svg";
  import blockIco from "@ui/assets/shield-svgrepo-com.svg";

  import { getContext, createEventDispatcher } from "svelte";
  import { string } from "@ui/utils/formatting";
  export let i;
  export let depth;
  export let entity = {};
  $: ({
    bestAttackLevel$,
    parryLevel$,
    blockLevel$,
    owner$,
    exists,
    id,
    disabled,
    hidden,
  } = entity);
  export let display = "table";
  const { character } = getContext("editor") || {};
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
      class="text-center cell-click"
      on:click={() => entity.executeAction('roll', { for: 'attack' })}>
      <div>
        <img src={attackIco} alt="" />
        <span>{string($bestAttackLevel$)}</span>
      </div>
    </td>
    <td
      class="text-center cell-click"
      on:click={() => entity.executeAction('roll', { for: 'parry' })}>
      <div>
        <img src={parryIco} alt="" />
        <span>{string($parryLevel$, { fallback: 'No' })}</span>
      </div>
    </td>
    <td
      class="text-center cell-click"
      on:click={() => entity.executeAction('roll', { for: 'block' })}>
      <div>
        <img
          src={blockIco}
          alt="" /><span>{string($blockLevel$, { fallback: 'No' })}</span>
      </div>
    </td>
    <td>{string($entity.info)}</td>
    <td
      class="cell-click"
      on:click={() => entity.executeAction('roll', { for: 'damage' })}>
      <span class="fas fa-dice-d6 pr-1" />{string($entity.damage)}
      {string($entity.damageType)}
    </td>
    <td>{$entity.reach}</td>
    <td>{$entity.strength}</td>
  {:else if display === 'list'}
    <li class="text-sm italic hover:underline">
      <div class="flex">
        <span>
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
        </span>
      </div>
    </li>
  {/if}
{/if}
