<script>
  import { Text, Checkbox, Number, Select, Option } from "@ui/index";
  import {
    EquipmentModifierWeightType,
    EquipmentModifierWeightValueType,
    EquipmentModifierValueType,
    EquipmentModifierCostValueType,
  } from "@character/equipment/equipment";
  export let entity = null;
</script>

<style>
</style>

<div class="flex-col">
  <Text bind:value={$entity.name}>Name:</Text>
  <Text bind:value={$entity.techLevel}>Tech Level:</Text>
  <Checkbox bind:checked={$entity.enabled}>Enabled:</Checkbox>
  <Number bind:value={$entity.cost} />
  <Select bind:value={$entity.costType}>
    {#each Object.entries(EquipmentModifierCostValueType) as [key, value], i (i)}
      <Option {value}>{key}</Option>
    {/each}
  </Select>
  <Select bind:value={$entity.affects}>
    {#each Object.entries(EquipmentModifierWeightValueType) as [key, value], i (i)}
      <Option {value}>{key}</Option>
    {/each}
  </Select>
  <Text bind:value={$entity.notes}>Notes</Text>
  <Text bind:value={$entity.reference}>Ref</Text>
</div>
