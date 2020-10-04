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
</style>

<Text bind:value={$entity.name}>Name:</Text>
<Checkbox bind:checked={$entity.enabled}>Enabled:</Checkbox>
<Number bind:value={$entity.cost}>Cost:</Number>
<Select bind:value={$entity.type}>
  {#each Object.entries(TraitModifierType) as [key, value], i (i)}
    <Option {value}>{key}</Option>
  {/each}
  <Option
    value={TraitModifierType.leveledPercentage}
    bind:selected={$entity.hasLevels}>
    % Per Level
  </Option>
</Select>
<Number bind:value={$entity.levels} disabled={!$entity.hasLevels}>
  Levels:
</Number>
<Number disabled={true} value={$entity.costModifier()} />
<Select bind:value={$entity.affects}>
  {#each Object.entries(TraitModifierAffects) as [key, value], i (i)}
    <Option {value}>{key}</Option>
  {/each}
</Select>
<Text bind:value={$entity.notes}>Notes</Text>
<Text bind:value={$entity.reference}>Ref</Text>
