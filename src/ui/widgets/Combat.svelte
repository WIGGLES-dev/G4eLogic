<script>
  import { getContext } from "svelte";
  import { tooltip } from "@internal";
  import {
    sizeModifierTooltip,
    swingDamageTooltip,
    thrustDamageTooltip,
  } from "@ui/tooltips/index";

  const { character } = getContext("editor");
  const { swingDamage$, thrustDamage$ } = character;
</script>

<style>
  :global(.damage-table) {
    @apply text-center;
  }
  :global(.damage-table td) {
    @apply border border-white border-solid px-1;
  }
</style>

<section>
  <div class="flex mb-2">
    <label
      use:tooltip={{ tipclass: 'text-sm', tooltip: sizeModifierTooltip }}
      class="w-1/2 underline text-center font-semibold"
      for="">
      Size
    </label>
    <div class="flex w-1/2">
      <input
        bind:value={$character.sizeModifier}
        placeholder="0"
        class="w-12 outline-none border-b border-solid border-red-700 rounded-r-md text-center"
        type="number" />
    </div>
  </div>
  <div
    class="flex"
    use:tooltip={{ tipclass: 'text-sm', tooltip: swingDamageTooltip }}>
    <span class="flex-1 text-center font-semibold">Swing </span>
    <span class="flex-1">
      <span
        class="fas fa-dice-d6 hover:text-red-700 pr-1" />{$swingDamage$}</span>
  </div>
  <div
    class="flex"
    use:tooltip={{ tipclass: 'text-sm', tooltip: thrustDamageTooltip }}>
    <span class="flex-1 text-center font-semibold">Thrust </span>
    <span class="flex-1">
      <span
        class="fas fa-dice-d6 hover:text-red-700 pr-1" />{$thrustDamage$}</span>
  </div>
</section>
