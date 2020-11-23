<script>
  import Form from "@ui/form/Form";
  import {
    EquipmentModifierWeightType,
    EquipmentModifierWeightValueType,
    EquipmentModifierCostValueType,
  } from "@internal";
  export let entity = null;
</script>

<style>
</style>

<Form>
  <label for="">Name<input type="text" bind:value={$entity.name} /></label>
  <label for="">Tech Level<input
      type="text"
      bind:value={$entity.techLevel} /></label>
  <label for="">Enabled<input
      type="checkbox"
      bind:value={$entity.enabled} /></label>
  <label for="">Cost Modifier<input
      type="number"
      bind:value={$entity.cost} /></label>
  <label for="">Cost Modifier Type
    <select bind:value={$entity.costType}>
      {#each Object.entries(EquipmentModifierCostValueType) as [key, value], i (i)}
        <option {value}>{key}</option>
      {/each}
    </select>
  </label>
  <label for="">Weight Modifier Type
    <select bind:value={$entity.affects}>
      {#each Object.entries(EquipmentModifierWeightValueType) as [key, value], i (i)}
        <option {value}>{key}</option>
      {/each}
    </select>
  </label>
  <label for="">Notes<textarea bind:value={$entity.notes} /></label>
  <label for="">Reference
    <input type="text" bind:value={$entity.reference} /></label>
</Form>
