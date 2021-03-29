<script lang="ts">
  import { getContext, onMount, onDestroy } from "svelte";
  import { tooltip } from "@ui/utils/use";
  import {
    sizeModifierTooltip,
    swingDamageTooltip,
    thrustDamageTooltip,
  } from "@ui/tooltips/index";
  import { System } from "@internal";
  import { Character as CharacterWorker } from "@app/gurps/resources/character";
  import { mergeMap, tap } from "rxjs/operators";
  import { State } from "rxdeep";
  import { Observable } from "rxjs";
  import { Remote } from "comlink";
  const state = getContext<State<any>>("sheet");
  const character$ = getContext<Observable<Remote<CharacterWorker>>>("worker");
  const swingDamage$ = character$.pipe(mergeMap((c) => c.getSwingDamage()));
  const thrustDamage$ = character$.pipe(mergeMap(c => c.getThrustDamage()));
  const sm$ = state.sub("profile", "sizeModifier");
</script>

<section>
  <label use:tooltip={{ tipclass: "text-sm", tooltip: sizeModifierTooltip }}>
    <span class="w-1/2 underline text-center font-semibold inline-block"
      >Size</span
    >
    <input
      bind:value={$sm$}
      placeholder="0"
      class="w-12 outline-none border-b border-solid border-red-700 rounded-r-md text-center"
      type="number"
    />
  </label>
  <div
    class="flex"
    use:tooltip={{ tipclass: "text-sm", tooltip: swingDamageTooltip }}
  >
    <span class="flex-1 text-center font-semibold">Swing</span>
    <div class="flex-1">
      <span
        class="cursor-pointer"
        on:click={(e) => System.roll(`${$swingDamage$}`)}>{$swingDamage$}</span
      >
    </div>
  </div>
  <div
    class="flex"
    use:tooltip={{ tipclass: "text-sm", tooltip: thrustDamageTooltip }}
  >
    <span class="flex-1 text-center font-semibold">Thrust</span>
    <div class="flex-1">
      <span
        class="cursor-pointer"
        on:click={(e) => System.roll(`${$thrustDamage$}`)}
        >{$thrustDamage$}</span
      >
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
