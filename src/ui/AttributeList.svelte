<script lang="ts">
  import { State } from "rxdeep";
  import { getContext } from "svelte";
  import { System } from "@internal";
  import { tooltip } from "@ui/utils/use";
  import { bind } from "@utils/use";
  import { Character as CharacterWorker } from "@app/gurps/resources/character";
  import Popper from "@components/Popper.svelte";
  import { Remote, proxy, releaseProxy } from "comlink";
  import {
    defaultIfEmpty,
    filter,
    mergeMap,
    pluck,
    startWith,
    switchMap,
    tap,
  } from "rxjs/operators";
  import { withComlinkProxy } from "@utils/operators";
  import { from, Observable, using } from "rxjs";
  const state = getContext<State<any>>("sheet");
  const order$: Observable<string[]> = state.pipe(
    pluck("config", "ui", "attributeOrder")
  );
  const character$ = getContext<Observable<Remote<CharacterWorker>>>("worker");
  const attributes$ = character$.pipe(
    mergeMap((c) => c.getAttributeCollection())
  );
  $: attributes =
    $order$?.map((attr) => ($attributes$ || {})[attr])?.filter((v) => !!v) ??
    [];
  function isPrimary(attr) {
    return attr.tags.includes("primary");
  }
  function isSecondary(attr) {
    return attr.tags.includes("secondary");
  }
  function isTertiary(attr) {
    return attr.tags.includes("tertiary");
  }
  function isSubstat(attr) {
    return attr.tags.includes("sub-stat");
  }
  function isPool(attr) {
    return attr.tags.includes("pool");
  }
</script>

<section class="grid gap-y-1">
  <div class="flex bg-gray-700 col-span-2">
    <span
      class="col-span-2 text-center m-auto text-white bg-gray-700"
      use:tooltip={{
        placement: "bottom-start",
        tooltip: `
      Attributes from the configuration panel. Clicking the dice will roll the styles number.<br/>
      The mod input will adjust the main attribute without adjusting point total.<br/>
      the number in brackets is the amount of points spent modifying the attribute.<br/>
      You can configure these attributes in the configuration panel.`,
      }}
    >
      ATTRIBUTE
    </span>
  </div>
  <span class="text-center text-white bg-gray-700">MOD</span>
  <span class="text-center text-white bg-gray-700 px-2">PTS</span>
  {#each attributes as attr, i (attr.name)}
    {#if (!isSubstat(attr) || true) && !isPool(attr)}
      <div
        class:primary={isPrimary(attr)}
        class:secondary={isSecondary(attr)}
        class:tertiary={isTertiary(attr)}
        class:sub-stat={isSubstat(attr)}
        class="truncate uppercase"
      >
        <span
          on:click={(e) => System.roll(`3d6ms${attr.level}`)}
          class="float-right pr-2 cursor-pointer"
          use:tooltip={{
            context: attr,
            tipclass: "text-xs",
            placement: "bottom-start",
            tooltip: `${attr.keys.tooltip || ""}`,
          }}
          >{attr.keys.abbreviation}
        </span>
      </div>
      <span
        class="attribute-text"
        class:primary={isPrimary(attr)}
        class:secondary={isSecondary(attr)}
        class:tertiary={isTertiary(attr)}
        class:sub-stat={isSubstat(attr)}
        class:bg-white={isPrimary(attr)}
        class:text-black={isPrimary(attr)}
        class:bg-gray-700={!isPrimary(attr)}
        class:text-white={!isPrimary(attr)}
      >
        <input
          class="main-input"
          step={attr.keys.increment || 1}
          type="number"
          min="0"
          placeholder="0"
          value={attr.level}
          on:change={(e) =>
            state.merge({
              attributeLevels: {
                [attr.name]: {
                  level: +e.target["value"] - attr.bonus - attr.mod - attr.base,
                },
              },
            })}
        />
      </span>
      <input
        class="mod-input"
        step={attr.keys.increment || 1}
        type="number"
        placeholder="0"
        value={attr.mod}
        on:change={(e) =>
          state.merge({
            attributeLevels: {
              [attr.name]: {
                mod: +e.target["value"],
              },
            },
          })}
      />
      <span class="text-sm text-center self-center"
        >{#if attr.keys.costPerLevel}
          [{attr.pointsSpent}]
        {/if}
      </span>
    {/if}
  {/each}
</section>

<style lang="postcss">
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
    @apply italic;
  }
  .attribute-text {
    @apply mr-2 rounded-r-lg;
  }
  .main-input {
    @apply w-16 rounded text-center outline-none bg-transparent border-none;
  }
  .mod-input {
    @apply w-10 border-b border-black border-solid m-auto text-sm outline-none text-center;
  }
</style>
