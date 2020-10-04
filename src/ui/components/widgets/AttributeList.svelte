<script>
  import { getContext } from "svelte";

  import { createTooltip } from "@ui/utils/popper";

  import { Number } from "@ui/index";

  import { attr } from "svelte/internal";
  export let attributes = [];

  const { character } = getContext("app");

  $: attributes = [...$character.attributeList.attributes.values()];

  function isPrimary(attr) {
    return attr.hasTag("primary");
  }
  function isSecondary(attr) {
    return attr.hasTag("secondary");
  }
  function isTertiary(attr) {
    return attr.hasTag("tertiary");
  }
  function isSubstat(attr) {
    return attr.hasTag("sub-stat");
  }
  function isPool(attr) {
    return attr.hasTag("pool");
  }
</script>

<style>
  .grid {
    height: min-content;
    grid-template-columns: auto auto auto auto;
  }
  .primary {
    @apply text-xl font-bold text-red-700 border-b border-solid border-red-700 mb-1;
  }
  .secondary {
    @apply text-lg font-semibold;
  }
  .tertiary {
  }
  .sub-stat {
    @apply text-sm italic;
  }
</style>

<section class="grid gap-y-1">
  <div class="flex bg-gray-700 col-span-2">
    <span
      class="col-span-2 text-center m-auto text-white bg-gray-700"
      use:createTooltip={{ tipclass: 'text-sm', placement: 'bottom-start', tooltip: `
      Attributes from the configuration panel. Clicking the dice will roll the styles number.<br/>
      The mod input will adjust the main attribute without adjusting point total.<br/>
      the number in brackets is the amount of points spent modifying the attribute.<br/>
      You can configure these attributes in the configuration panel.` }}>ATTRIBUTE</span>
  </div>
  <span class="text-center text-white bg-gray-700">MOD</span>
  <span class="text-center text-white bg-gray-700">PTS</span>

  {#each attributes as attr, i (attr.id)}
    {#if (!isSubstat(attr) || true) && !isPool(attr)}
      <div
        class:primary={isPrimary(attr)}
        class:secondary={isSecondary(attr)}
        class:tertiary={isTertiary(attr)}
        class:sub-stat={isSubstat(attr)}
        class="truncate uppercase">
        <span
          class="float-right pr-2"
          use:createTooltip={{ context: attr, tipclass: 'text-xs', placement: 'bottom-start', tooltip: `${attr.ui.tooltip || ''}` }}>{attr.abbreviation}
        </span>
      </div>
      <span
        class="pr-1 rounded-r-lg"
        class:primary={isPrimary(attr)}
        class:secondary={isSecondary(attr)}
        class:tertiary={isTertiary(attr)}
        class:sub-stat={isSubstat(attr)}
        class:bg-white={isPrimary(attr)}
        class:text-black={isPrimary(attr)}
        class:bg-gray-700={!isPrimary(attr)}
        class:text-white={!isPrimary(attr)}>
        <input
          class="w-16 rounded text-center outline-none bg-transparent"
          step={attr.increment}
          type="number"
          bind:value={attr.displayLevel} />
        <span class="fas fa-dice-d6 hover:text-red-700" />
      </span>
      <input
        class="w-10 ml-2 border-b border-black border-solid m-auto text-sm outline-none text-center"
        step={attr.increment}
        type="number"
        bind:value={attr.modifier} />
      <span class="text-sm text-center px-2 self-center">{#if attr.costPerLevel}
          [{attr.pointsSpent()}]
        {/if}</span>
    {/if}
  {/each}
</section>
