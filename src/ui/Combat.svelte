<script lang="ts">
  import { getContext } from "svelte";
  import { tooltip, Character } from "@internal";
  import {
    sizeModifierTooltip,
    swingDamageTooltip,
    thrustDamageTooltip,
  } from "@ui/tooltips/index";

  const character = getContext<Character>("sheet");
  const { swingDamage$, thrustDamage$ } = character;
</script>

<section>
  <label use:tooltip={{ tipclass: "text-sm", tooltip: sizeModifierTooltip }}>
    <span class="w-1/2 underline text-center font-semibold inline-block"
      >Size</span
    >
    <input
      bind:value={$character.profile.sizeModifier}
      placeholder="0"
      class="w-12 outline-none border-b border-solid border-red-700 rounded-r-md text-center"
      type="number"
    />
  </label>
  <div
    class="flex"
    use:tooltip={{ tipclass: "text-sm", tooltip: swingDamageTooltip }}
  >
    <span class="flex-1 text-center font-semibold">Swing </span>
    <span class="flex-1">
      <span
        class="fas fa-dice-d6 hover:text-red-700 pr-1"
      />{$swingDamage$}</span
    >
  </div>
  <div
    class="flex"
    use:tooltip={{ tipclass: "text-sm", tooltip: thrustDamageTooltip }}
  >
    <span class="flex-1 text-center font-semibold">Thrust </span>
    <span class="flex-1">
      <span
        class="fas fa-dice-d6 hover:text-red-700 pr-1"
      />{$thrustDamage$}</span
    >
  </div>
</section>

<style lang="postcss">
  :global(.damage-table) {
    @apply text-center;
  }
  :global(.damage-table td) {
    @apply border border-white border-solid px-1;
  }
</style>
