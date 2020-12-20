<script lang="ts">
  import { getContext } from "svelte";
  import { string, Valor, MeleeWeapon } from "@internal";

  const { attackIco, parryIco, blockIco } = Valor.assets;

  export let entity = {} as MeleeWeapon;
  $: ({ bestAttackLevel$, parryLevel$, blockLevel$, parent$, exists } = entity);
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
    <td>{string($parent$.keys.name)}</td>
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
    <td>{$entity.strengthRequirement}</td>
  {:else if display === 'list'}
    <li class="text-sm italic hover:underline">
      <div class="flex">
        <span>
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
        </span>
      </div>
    </li>
  {/if}
{/if}
