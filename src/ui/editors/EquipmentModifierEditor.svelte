<script context="module" lang="ts">
  import {
    EquipmentModifierWeightType,
    EquipmentModifierWeightValueType,
    EquipmentModifierCostValueType,
  } from "@app/gurps/resources/equipment";
</script>

<script lang="ts">
  export let entity = null;
</script>

<form>
  <label>
    <span>Name</span>
    <input type="text" bind:value="{$entity.name}" />
  </label>
  <label>
    <span>Tech Level</span>
    <input type="text" bind:value="{$entity.techLevel}" />
  </label>
  <label>
    <span>Enabled</span>
    <input type="checkbox" bind:value="{$entity.enabled}" />
  </label>
  <label>
    <span>Cost Modifier</span>
    <input type="number" bind:value="{$entity.cost}" />
  </label>
  <label>
    <span>Cost Modifier Type</span>
    <select bind:value="{$entity.costType}">
      {#each Object.entries(EquipmentModifierCostValueType) as [key, value], i (i)}
        <option value="{value}">{key}</option>
      {/each}
    </select>
  </label>
  <label>
    <span>Weight Modifier Type</span>
    <select bind:value="{$entity.affects}">
      {#each Object.entries(EquipmentModifierWeightValueType) as [key, value], i (i)}
        <option value="{value}">{key}</option>
      {/each}
    </select>
  </label>
  <label>
    <span>Notes</span>
    <textarea bind:value="{$entity.notes}"></textarea>
  </label>
  <label>
    <span>Reference</span>
    <input type="text" bind:value="{$entity.reference}" />
  </label>
</form>

<style>
</style>
