<script lang="ts">
  import Popper from "@components/Popper.svelte";
  import { pluck } from "rxjs/operators";
  import { interpolate } from "@app/utils/strings";
  import type { Character } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { state, processed$, System } = getEditorContext<Character>();
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

<table class="{classList}">
  <caption>
    <!--  -->
  </caption>
  <Popper
    let:reference
    let:popper
    display="hovered virtual"
    placement="bottom-start"
    modifiers="{[
      {
        name: 'offset',
        options: {
          offset: [16, 16],
        },
      },
    ]}"
  >
    <thead use:reference>
      <tr>
        <th colspan="2">
          Attribute
          <div use:popper class="tooltip">
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
        </th>
        <th>Mod</th>
      </tr>
    </thead>
  </Popper>
  <tbody>
    {#each attributes as attr (attr.name)}
      <tr>
        <td>
          <div
            class:primary="{isPrimary(attr)}"
            class:secondary="{isSecondary(attr)}"
            class:tertiary="{isTertiary(attr)}"
            class:sub-stat="{isSubstat(attr)}"
            class="flex justify-end pr-2"
            on:click="{(e) => System.roll(`3d6ms${attr.level}`)}"
          >
            <Popper
              let:popper
              let:reference
              display="hovered virtual"
              placement="bottom-start"
              offset="{[16, 16]}"
            >
              <span use:reference class="truncate uppercase cursor-pointer">
                {attr.keys.abbreviation}
                {#if attr.keys.costPerLevel}
                  [{attr.pointsSpent}]
                {/if}
              </span>
              <div class="tooltip" use:popper>
                {@html interpolate(attr.keys.tooltip, attr)}
              </div>
            </Popper>
          </div>
        </td>
        <td>
          <div
            class="attribute-text"
            class:primary="{isPrimary(attr)}"
            class:secondary="{isSecondary(attr)}"
            class:tertiary="{isTertiary(attr)}"
            class:sub-stat="{isSubstat(attr)}"
            class:bg-white="{isPrimary(attr)}"
            class:text-black="{isPrimary(attr)}"
            class:bg-gray-700="{!isPrimary(attr)}"
            class:text-white="{!isPrimary(attr)}"
          >
            <input
              class="main-input"
              step="{attr.keys.increment || 1}"
              type="number"
              min="0"
              placeholder="0"
              value="{attr.level}"
              on:change="{(e) =>
                state.merge({
                  attributeLevels: {
                    [attr.name]: {
                      level:
                        +e.target['value'] - attr.bonus - attr.mod - attr.base,
                    },
                  },
                })}"
            />
          </div>
        </td>
        <td>
          <input
            class="mod-input"
            step="{attr.keys.increment || 1}"
            type="number"
            placeholder="0"
            value="{attr.mod}"
            on:change="{(e) =>
              state.merge({
                attributeLevels: {
                  [attr.name]: {
                    mod: +e.target['value'],
                  },
                },
              })}"
          />
        </td>
      </tr>{/each}
  </tbody>
</table>

<style lang="postcss">
  td {
    @apply pt-1;
  }
  .primary {
    @apply font-bold text-red-700;
  }
  .secondary {
    @apply font-semibold;
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
    @apply w-10;
  }
</style>
