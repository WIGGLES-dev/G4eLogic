<script lang="ts">
  import { getContext, onMount, onDestroy } from "svelte";
  import { blur, fade } from "svelte/transition";
  import Popper from "@components/Popper.svelte";
  import {
    sizeModifierTooltip,
    swingDamageTooltip,
    thrustDamageTooltip,
  } from "@ui/tooltips/index";
  import { System } from "@internal";
  import { mergeMap, tap } from "rxjs/operators";
  import type { Character } from "@internal";
  import { getEditorContext } from "@ui/editors/Editor.svelte";
  const { state, processed$ } = getEditorContext<Character>();
  $: swingDamage = $processed$.swingDamage;
  $: thrustDamage = $processed$.thrustDamage;
  const sm$ = state.sub("profile", "sizeModifier");
</script>

<section>
  <label>
    <Popper
      display="hovered virtual"
      placement="bottom-start"
      offset={[16, 16]}
    >
      <div
        class="bg-gray-700 text-white text-xs p-2 text-left font-normal not-italic"
      >
        {@html sizeModifierTooltip}
      </div>
    </Popper>
    <span class="w-1/2 text-center font-semibold inline-block">SM</span>
    <input
      bind:value={$sm$}
      placeholder="0"
      class="w-12 text-center"
      type="number"
    />
  </label>
  <div class="flex">
    <Popper
      display="hovered virtual"
      placement="bottom-start"
      offset={[16, 16]}
    >
      <div class="tooltip">
        {@html swingDamageTooltip}
      </div>
    </Popper>
    <span class="flex-1 text-center font-semibold">Swing</span>
    <div class="flex-1">
      {#key swingDamage}
        <span
          out:fade={{ duration: 100 }}
          in:fade={{ delay: 100 }}
          class="cursor-pointer"
          on:click={(e) => System.roll(`${swingDamage}`)}
        >
          {swingDamage}
        </span>
      {/key}
    </div>
  </div>
  <div class="flex">
    <Popper
      display="hovered virtual"
      placement="bottom-start"
      offset={[16, 16]}
    >
      <div class="tooltip">
        {@html thrustDamageTooltip}
      </div>
    </Popper>
    <span class="flex-1 text-center font-semibold">Thrust</span>
    <div class="flex-1">
      {#key thrustDamage}
        <span
          out:fade={{ duration: 100 }}
          in:fade={{ delay: 100 }}
          class="cursor-pointer"
          on:click={(e) => System.roll(`${thrustDamage}`)}
        >
          {thrustDamage}
        </span>
      {/key}
    </div>
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
