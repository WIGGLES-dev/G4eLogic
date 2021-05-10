<script lang="ts">
  import type { HitLocation } from "@app/gurps/resources/character";
  import Meter from "@components/Form/Meter.svelte";
  import { getContext } from "svelte";
  import Editor, { editorctx } from "@app/ui/Editor.svelte";
  export let location: HitLocation;
  import { Character } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { processed$, state } = getEditorContext<Character>();
  const dt = state.sub("hitLocationDamage", location.name);
</script>

<div class="location" class:crippled="{location.isCrippled}">
  <div class="location-name ">
    {location.name}
  </div>
  {#if location.damageResistance > 0}
    <div class="text-center">DR:{location.damageResistance}</div>
  {/if}
  <input
    type="number"
    class="damage-input"
    placeholder="0"
    bind:value="{$dt}"
  />
  <Meter max="{location.crippleThreshold}" value="{$dt}" />
</div>

<style lang="postcss">
  .location {
    @apply text-center text-xs;
  }
  .location-name {
    @apply break-words capitalize;
  }
  .location.crippled {
    @apply bg-red-700;
  }
  .damage-input {
    @apply w-full outline-none block;
  }
  input {
    @apply text-center bg-transparent;
  }
</style>
