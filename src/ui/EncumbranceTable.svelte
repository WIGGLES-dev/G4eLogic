<script lang="ts">
  import { getContext } from "svelte";
  import Popper from "@components/Popper.svelte";
  import { mergeMap } from "rxjs/operators";
  import { from } from "rxjs";
  import { Character } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { state, processed$ } = getEditorContext<Character>();
  $: move = $processed$?.attributes?.move?.displayLevel ?? 5;
  $: lift = $processed$?.basicLift;
  $: dodge = $processed$?.attributes?.dodge?.displayLevel ?? 8;
  $: encumbrance = $processed$?.encumbranceLevel;
  $: carriedWeight = $processed$?.carriedWeight;
</script>

<table class:bg-red-300="{encumbrance === -5}">
  <Popper
    display="hovered virtual"
    offset="{[16, 16]}"
    let:popper
    let:reference
  >
    <caption use:reference>
      <span class="text-center underline">
        Carrying {carriedWeight}lbs.
      </span>
    </caption>
    <div class="tooltip" use:popper>
      <p>
        Encumbrance is a measure of how much equipment you are carrying versus
        Lifting Strength. Ref. BS17.
      </p>
      <p>Encumbrance can never reduce Move or Dodge below 1.</p>
    </div>
  </Popper>
  <thead>
    <tr>
      <th>Encumbrance</th>
      <th>Load</th>
      <th>Move</th>
      <th>Dodge</th>
    </tr>
  </thead>
  <tbody>
    <Popper
      display="hovered virtual"
      offset="{[16, 16]}"
      let:popper
      let:reference
    >
      <tr
        class:active="{encumbrance === 0}"
        class:none="{encumbrance === 0}"
        use:reference
      >
        <td>None [0]</td>
        <td>{lift}</td>
        <td>{move}</td>
        <td>{dodge}</td>
      </tr>
      <div class="tooltip" use:popper>
        <p>
          You are at None if your equipped weight is less than Basic Lift. You
          take no penalties.
        </p>
      </div>
    </Popper>
    <Popper
      display="hovered virtual"
      offset="{[16, 16]}"
      let:popper
      let:reference
    >
      <tr
        class:active="{encumbrance === -1}"
        class:light="{encumbrance === -1}"
        use:reference
      >
        <td>Light [-1]</td>
        <td>{lift * 2}</td>
        <td>{Math.floor(move * 0.8)}</td>
        <td>{dodge - 1}</td>
      </tr>
      <div class="tooltip" use:popper>
        <p>
          You are at Light if your equipped weight is above None and less than
          Basic Lift * 2.
        </p>
        <p>
          Your Move is multipled by 0.8x. All encumbrance sensitive skills and
          Dodge take a -1.
        </p>
      </div>
    </Popper>
    <Popper
      display="hovered virtual"
      offset="{[16, 16]}"
      let:popper
      let:reference
    >
      <tr
        class:active="{encumbrance === -2}"
        class:medium="{encumbrance === -2}"
        use:reference
      >
        <td>Medium [-2]</td>
        <td>{lift * 3}</td>
        <td>{Math.floor(move * 0.6)}</td>
        <td>{dodge - 2}</td>
      </tr>
      <div class="tooltip" use:popper>
        <p>
          You are at Medium if your equipped weight is above Light and less than
          Basic Lift * 3.
        </p>
        <p>
          Your Move is multipled by 0.6x. All encumbrance sensitive skills and
          Dodge take a -2.
        </p>
      </div>
    </Popper>
    <Popper
      display="hovered virtual"
      offset="{[16, 16]}"
      let:reference
      let:popper
    >
      <tr
        class:active="{encumbrance === -3}"
        class:heavy="{encumbrance === -3}"
        use:reference
      >
        <td>Heavy [-3]</td>
        <td>{lift * 6}</td>
        <td>{Math.floor(move * 0.4)}</td>
        <td>{dodge - 3}</td>
      </tr>
      <div class="tooltip" use:popper>
        <p>
          You are at Heavy if your equipped weight is above Medium and less than
          Basic Lift * 6.
        </p>
        <p>
          Your Move is multipled by 0.4x. All encumbrance sensitive skills and
          Dodge take a -3.
        </p>
      </div>
    </Popper>
    <Popper
      display="hovered virtual"
      offset="{[16, 16]}"
      let:popper
      let:reference
    >
      <tr
        class:active="{encumbrance === -4}"
        class:x-heavy="{encumbrance === -4}"
        use:reference
      >
        <td>X-Heavy [-4]</td>
        <td>{lift * 10}</td>
        <td>{Math.floor(move * 0.2)}</td>
        <td>{dodge - 4}</td>
      </tr>
      <div class="tooltip" use:popper>
        <p>
          You are at Extra Heavy if your equipped weight is above Heavy and less
          than Basic Lift * 10.
        </p>
        <p>
          Your Move is multipled by 0.2x. All encumbrance sensitive skills and
          Dodge take a -4.
        </p>
        <p>
          This is the maximum weight you can carry over LONG periods of time.
          See "Carry On Back" in Lifting & Moving for short term weight.
        </p>
      </div>
    </Popper>
  </tbody>
</table>

<style lang="postcss">
  table {
    @apply text-sm text-center;
  }
  tr {
    @apply border-b border-solid border-gray-500;
  }
  .active > td {
    @apply py-2;
  }
  .none {
    @apply bg-green-300;
  }
  .light {
    background-color: #d1e8a1;
  }
  .medium {
    @apply bg-yellow-300;
  }
  .heavy {
    @apply bg-red-300;
  }
  .x-heavy {
    @apply bg-red-500;
  }
  tr > td:first-child {
    @apply text-right pr-3;
  }
</style>
