<script>
  import { Text, Checkbox, Number, Select, Option } from "@ui/index";
  import {
    TraitModifierAffects,
    TraitModifierType,
  } from "@character/trait/trait";
  import TraitModifier from "../entities/TraitModifier.svelte";
  export let entity = null;
</script>

<style>
  label {
    @apply flex p-2;
  }

  div.flex label,
  input {
    @apply flex-1;
  }

  input,
  select {
    @apply border-b border-black border-solid outline-none ml-1;
  }

  input {
    @apply h-full pl-1;
  }

  textarea {
    @apply outline-none border border-black border-solid rounded mt-2 w-full;
  }
</style>

<form action="" class="p-3">
  <div class="flex">
    <label for="">Name<input
        class="flex-1"
        type="text"
        bind:value={entity.name} /></label>

    <label for="">Enabled<input
        type="checkbox"
        bind:checked={entity.enabled} /></label>
  </div>

  <div class="flex">
    <label for="">Cost <input type="number" bind:value={entity.cost} /></label>

    <select bind:value={entity.type}>
      {#each Object.entries(TraitModifierType) as [key, value], i (i)}
        <option {value}>{key}</option>
      {/each}
    </select>

    <label for="">Level<input
        type="number"
        bind:value={entity.level}
        disabled={!entity.hasLevels && entity.type !== TraitModifierType.percentage} /></label>

    <label for="">Has Levels
      <input
        type="checkbox"
        bind:checked={entity.hasLevels}
        disabled={entity.type !== TraitModifierType.percentage} /></label>
  </div>

  <div class="flex">
    <label for="">Final Modifier
      <input type="number" value={entity.costModifier()} /></label>

    <label for="">
      Affects
      <select bind:value={entity.affects}>
        {#each Object.entries(TraitModifierAffects) as [key, value], i (i)}
          <option {value}>{key}</option>
        {/each}
      </select>
    </label>

    <label for="">Reference
      <input type="number" bind:value={entity.reference} /></label>
  </div>

  <label for="">Notes </label>
  <textarea bind:value={entity.notes} name="" id="" rows="3" />
</form>
