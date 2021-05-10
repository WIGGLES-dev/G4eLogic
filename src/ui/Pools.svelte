<script lang="ts">
  import type { Remote } from "comlink";
  import { getContext } from "svelte";
  import Meter from "@components/Form/Meter.svelte";
  import { Character as CharacterWorker } from "@app/gurps/resources/character";
  import {
    filter,
    mergeAll,
    mergeMap,
    pluck,
    startWith,
    switchMap,
  } from "rxjs/operators";
  import { State } from "rxdeep";
  import Popper from "@components/Popper.svelte";
  import { from, Observable, using } from "rxjs";
  import { interpolate } from "@app/utils/strings";
  import { Character } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { state, processed$ } = getEditorContext<Character>();
  const order$ = state.pipe(pluck("config", "ui", "poolOrder"));
  $: pools =
    $order$
      ?.map((attr) => ($processed$?.attributes ?? {})[attr])
      ?.filter((v) => !!v) ?? [];
  let classList = "";
  export { classList as class };
  let rowHeights: Record<string, number> = {};
  $: computeGradientStyle = (attr) => {
    const { keys: { color = "red" } = {}, current = 10, level = 10 } =
      attr || {};
    const width = Math.min(Math.floor((attr.current / attr.level) * 100), 100);
    return `
            background: 
                linear-gradient(
                    to right,
                    ${color} ${width}%,
                    white ${100 - width}%
                )
        `;
  };
</script>

<table class="{classList}">
  <caption>
    <!--  -->
  </caption>
  <thead>
    <tr>
      <th>Pool</th>
      <th>Cur/Total</th>
      <th>Mod</th>
    </tr>
  </thead>
  <tbody>
    {#each pools as attr, i (attr.name)}
      <tr>
        <td>
          <Popper
            let:popper
            let:reference
            display="hovered virtual"
            offset="{[16, 16]}"
            placement="bottom-end"
          >
            <span use:reference class="truncate uppercase font-semibold">
              {attr.keys.abbreviation}
              {#if attr.keys.costPerLevel}
                [{attr.pointsSpent}]
              {/if}
            </span>
            <div class="tooltip" use:popper>
              {@html interpolate(attr.keys.tooltip, attr)}
            </div>
          </Popper>
        </td>
        <td>
          <input
            class="current-input"
            type="number"
            placeholder="0"
            value="{attr.current}"
            on:change="{(e) =>
              state.merge({
                attributeLevels: {
                  [attr.name]: {
                    current: +e.target['value'],
                  },
                },
              })}"
          />
          <input
            class="max-input"
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
          <hr />
          <Meter
            class="table-row w-full"
            max="{attr.level}"
            value="{attr.current}"
            color="{attr.keys.color}"
          />
        </td>
        <td>
          <input
            class="mod-input"
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
      </tr>
    {/each}
  </tbody>
</table>

<style lang="postcss">
  tr {
    @apply transition-all delay-1000;
  }
  input {
    @apply text-center w-10 text-xs;
  }
  .current-input {
  }
  .max-input {
  }
  .mod-input {
  }
</style>
