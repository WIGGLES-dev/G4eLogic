<script>
  import { Text, Checkbox, Number, Select, Option } from "@ui/index";
  import {
    TraitModifierAffects,
    TraitModifierType,
  } from "@character/trait/trait";
  export let entity = null;
</script>

<style>
</style>

<div class="flex-col">
  <Text bind:value={$entity.name} />
  <Checkbox bind:checked={$entity.enabled} />
  <Number bind:value={$entity.cost} />
  <Select bind:value={$entity.type}>
    {#each Object.entries(TraitModifierType) as [key, value], i (i)}
      <Option {value}>{key}</Option>
    {/each}
    <Option bind:selected={$entity.hasLevels}>% Per Level</Option>
  </Select>
  <Number bind:value={$entity.levels} disabled={!$entity.hasLevel} />
  <Select bind:value={$entity.affects}>
    {#each Object.entries(TraitModifierAffects) as [key, value], i (i)}
      <Option {value}>{key}</Option>
    {/each}
  </Select>
</div>
