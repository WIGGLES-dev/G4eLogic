<script lang="ts">
  import { getContext } from "svelte";
  import Popper from "@components/Popper.svelte";
  import { mergeMap, pluck, tap } from "rxjs/operators";
  import { Observable } from "rxjs";
  import { interpolate } from "@app/utils/strings";
  import { System } from "@internal";
  import type { Character } from "@internal";
  import { getEditorContext } from "@ui/editors/Editor.svelte";
  const { state, processed$ } = getEditorContext<Character>();
  const order$ = state.pipe(pluck("config", "ui", "attributeOrder"));
  $: attributes =
    $order$
      ?.map((attr) => ($processed$?.attributes ?? {})[attr])
      ?.filter((v) => !!v) ?? [];
  let classList = "";
  export { classList as class };
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

<table class={classList}>
  <caption>
    <!--  -->
  </caption>
  <thead>
    <tr class="bg-gray-700 text-white">
      <th colspan="2">
        ATTRIBUTE
        <Popper
          display="hovered virtual"
          placement="bottom-start"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [16, 16],
              },
            },
          ]}
        >
          <div class="bg-gray-700 text-white text-sm p-2 text-left">
            <ul class="list-disc list-inside">
              <li>Clicking the attribute name will roll the attribute.</li>
              <li>
                The mod input will adjust the main attribute without adjusting
                point total.
              </li>
              <li>
                the number in brackets is the amount of points spent modifying
                the attribute.
              </li>
              <li>You can configure these attributes in the settings tab.</li>
            </ul>
          </div>
        </Popper>
      </th>
      <th>MOD</th>
      <th>PTS</th>
    </tr>
  </thead>
  <tbody>
    {#each attributes as attr (attr.name)}
      <tr>
        <td>
          <div
            class:primary={isPrimary(attr)}
            class:secondary={isSecondary(attr)}
            class:tertiary={isTertiary(attr)}
            class:sub-stat={isSubstat(attr)}
            class="flex justify-end pr-2"
            on:click={(e) => System.roll(`3d6ms${attr.level}`)}
          >
            <span class="truncate uppercase cursor-pointer">
              {attr.keys.abbreviation}
            </span>
            <Popper
              display="hovered virtual"
              placement="bottom-start"
              offset={[16, 16]}
            >
              <div class="tooltip">
                {@html interpolate(attr.keys.tooltip, attr)}
              </div>
            </Popper>
          </div>
        </td>
        <td>
          <div
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
                      level:
                        +e.target["value"] - attr.bonus - attr.mod - attr.base,
                    },
                  },
                })}
            />
          </div>
        </td>
        <td>
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
        </td>
        <td class="text-sm text-center self-center">
          {#if attr.keys.costPerLevel}
            {attr.pointsSpent}
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="postcss">
  td {
    @apply px-0;
  }
  .primary {
    @apply text-xl font-bold text-red-700 border-b border-solid border-red-700;
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
  input {
    @apply text-center;
  }
  .main-input {
    @apply w-16 bg-transparent;
  }
  .mod-input {
    @apply w-10 border-b border-black border-solid m-auto;
  }
</style>
