<script lang="ts">
  import { getContext } from "svelte";
  import { System } from "@internal";
  import { mergeMap, pluck, startWith } from "rxjs/operators";
  import { blur, fade } from "svelte/transition";
  import Popper from "@components/Popper.svelte";
  import {
    sizeModifierTooltip,
    swingDamageTooltip,
    thrustDamageTooltip,
  } from "@ui/tooltips/index";
  import { Character } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { state, processed$ } = getEditorContext<Character>();
  type pd = ReturnType<Character["process"]>;
  $: ({
    unspent = 0,
    spent = 0,
    racialPoints = 0,
    advantages = 0,
    disadvantages = 0,
    attributePoints = 0,
    perks = 0,
    quirks = 0,
    skills = 0,
    techniques = 0,
    spells = 0,
  } = $processed$?.pointTotals ?? ({} as pd["pointTotals"]));
  const pointTotal = state.sub("pointTotal");
  $: swingDamage = $processed$.swingDamage;
  $: thrustDamage = $processed$.thrustDamage;
  const sm$ = state.sub("profile", "sizeModifier");
</script>

<div class="statistics">
  <div class="text-center">Point Total [{unspent}]</div>
  <input
    class="text-center bg-gray-200 p-1 outline-none block w-full"
    type="number"
    placeholder="0"
    bind:value={$pointTotal}
  />
  <div class="pt-pair">
    <div>Spent</div>
    <div>{spent}</div>
  </div>
  <div class="pt-pair">
    <div>Race</div>
    <div>{racialPoints}</div>
  </div>
  <div class="pt-pair">
    <div>Adv.</div>
    <div>{advantages + perks}</div>
  </div>
  <div class="pt-pair">
    <div>Attr.</div>
    <div>{attributePoints}</div>
  </div>
  <div class="pt-pair">
    <div>Disad.</div>
    <div>{disadvantages}</div>
  </div>
  <div class="pt-pair">
    <div>Quirks</div>
    <div>{quirks}</div>
  </div>
  <div class="pt-pair">
    <div>Skills</div>
    <div>{skills}</div>
  </div>
  <div class="pt-pair">
    <div>Spells</div>
    <div>{spells}</div>
  </div>
  <div class="stat-sm">
    <Popper
      display="hovered virtual"
      placement="bottom-start"
      offset={[16, 16]}
      let:reference
      let:popper
    >
      <div use:reference>SM</div>
      <div class="tooltip" use:popper>
        {@html sizeModifierTooltip}
      </div>
    </Popper>

    <input
      bind:value={$sm$}
      placeholder="0"
      class="text-center block w-full"
      type="number"
    />
  </div>

  <div
    class="pt-pair cursor-pointer"
    on:click={(e) => System.roll(`${swingDamage}`)}
  >
    <Popper
      display="hovered virtual"
      placement="bottom-start"
      offset={[16, 16]}
      let:reference
      let:popper
    >
      <div use:reference>Swing</div>
      <div class="tooltip" use:popper>
        {@html swingDamageTooltip}
      </div>
    </Popper>

    {#key swingDamage}
      <span class="damage" in:fade>{swingDamage}</span>
    {/key}
  </div>
  <div
    class="pt-pair cursor-pointer"
    on:click={(e) => System.roll(`${thrustDamage}`)}
  >
    <Popper
      display="hovered virtual"
      placement="bottom-start"
      offset={[16, 16]}
      let:reference
      let:popper
    >
      <div use:reference>Thrust</div>
      <div class="tooltip" use:popper>
        {@html thrustDamageTooltip}
      </div>
    </Popper>

    {#key thrustDamage}
      <div class="damage" in:fade>
        {thrustDamage}
      </div>
    {/key}
  </div>
</div>

<style lang="postcss">
  .pt-pair {
    @apply flex;
  }
  .pt-pair > *:first-child {
    @apply font-semibold;
  }
  .pt-pair > *:nth-child(2) {
  }
  .pt-pair > * {
    @apply flex-1 text-center;
  }
  .damage {
    @apply block w-full h-full;
  }
  .stat-sm {
    @apply p-1 m-1 border;
  }
  .stat-sm > * {
    @apply text-center;
  }
  .stat-sm > *:first-child {
    @apply text-center font-semibold;
  }
</style>
