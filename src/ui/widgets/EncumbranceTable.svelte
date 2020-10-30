<script>
  import { getContext } from "svelte";
  import { createTooltip } from "@ui/utils/popper";

  const { character } = getContext("editor");

  $: carriedWeight = $character.equipmentList.totalWeight({
    carriedOnly: true,
  });
  $: encLevel = $character.encumbranceLevel();
  $: move = $character.getAttribute("move").calculateLevel();
  $: lift = $character.basicLift();
  $: dodge = $character.dodgeScore();
</script>

<style>
  th {
    @apply p-1 pt-0 pb-0;
  }
  tr {
    @apply border-b border-solid border-gray-500;
  }
  .light {
    background-color: #d1e8a1;
  }
  .active > td {
    @apply p-2 pr-0 pl-0;
  }

  tr > td:first-child {
    @apply text-right pr-3;
  }
</style>

<section>
  <table class="text-center text-sm" class:bg-red-300={encLevel === -5}>
    <caption>
      <span class="text-center underline">Carrying: {carriedWeight} lbs. </span>
    </caption>
    <thead
      use:createTooltip={{ tipclass: 'text-sm', tooltip: `
    Encumbrance is a measure of how much equipment you are carrying versus Lifting Strength. Ref. BS17.<br/>
    Encumbrance can never reduce Move or Dodge below 1. 
    ` }}>
      <tr>
        <th>Encumbrance</th>
        <th>Load</th>
        <th>Move</th>
        <th>Dodge</th>
      </tr>
    </thead>
    <tbody>
      <tr
        class:active={encLevel === 0}
        class:bg-green-300={encLevel === 0}
        use:createTooltip={{ tipclass: 'text-sm', tooltip: `
        You are at None if your equipped weight is less than Basic Lift. You take no penalties.
      ` }}>
        <td>None [0]</td>
        <td>{lift}</td>
        <td>{move}</td>
        <td>{dodge}</td>
      </tr>
      <tr
        class:active={encLevel === -1}
        class:light={encLevel === -1}
        use:createTooltip={{ tipclass: 'text-sm', tooltip: `
        You are at Light if your equipped weight is above None and less than Basic Lift * 2.<br/>
	      Your Move is multipled by 0.8x. All encumbrance sensitive skills and Dodge take a -1.
        ` }}>
        <td>Light [-1]</td>
        <td>{lift * 2}</td>
        <td>{Math.floor(move * 0.8)}</td>
        <td>{dodge - 1}</td>
      </tr>
      <tr
        class:active={encLevel === -2}
        class:bg-yellow-300={encLevel === -2}
        use:createTooltip={{ tipclass: 'text-sm', tooltip: `
        You are at Medium if your equipped weight is above Light and less than Basic Lift * 3.<br/>
	      Your Move is multipled by 0.6x. All encumbrance sensitive skills and Dodge take a -2.
        ` }}>
        <td>Medium [-2]</td>
        <td>{lift * 3}</td>
        <td>{Math.floor(move * 0.6)}</td>
        <td>{dodge - 2}</td>
      </tr>
      <tr
        class:active={encLevel === -3}
        class:bg-orange-300={encLevel === -3}
        use:createTooltip={{ tipclass: 'text-sm', tooltip: `
        You are at Heavy if your equipped weight is above Medium and less than Basic Lift * 6.<br/>
        Your Move is multipled by 0.4x. All encumbrance sensitive skills and Dodge take a -3.
        ` }}>
        <td>Heavy [-3]</td>
        <td>{lift * 6}</td>
        <td>{Math.floor(move * 0.4)}</td>
        <td>{dodge - 3}</td>
      </tr>
      <tr
        class:active={encLevel === -4}
        class:bg-red-300={encLevel === -4}
        use:createTooltip={{ tipclass: 'text-sm', tooltip: `
        You are at Extra Heavy if your equipped weight is above Heavy and less than Basic Lift * 10.<br/>
        Your Move is multipled by 0.2x. All encumbrance sensitive skills and Dodge take a -4.<br/>
        This is the maximum weight you can carry over LONG periods of time. See "Carry On Back" in Lifting & Moving for short term weight.
        ` }}>
        <td>X-Heavy [-4]</td>
        <td>{lift * 10}</td>
        <td>{Math.floor(move * 0.2)}</td>
        <td>{dodge - 4}</td>
      </tr>
    </tbody>
  </table>
</section>
