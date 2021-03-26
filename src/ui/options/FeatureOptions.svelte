<script lang="ts">
  import { FeatureBonusType } from "@app/gurps/resources/interfaces";
  export let feature: FeatureBonusType;
</script>

<select bind:value={feature}>
  <option value={undefined}>Select A Feature</option>
  <option value={FeatureBonusType.Attribute}>
    Gives an attribute bonus of
  </option>
  <option value={FeatureBonusType.Armor}>Gives a DR bonus of</option>
  <option disabled={true}>Gives a reaction modifier of</option>
  <option value={FeatureBonusType.Skill}>Gives a skill level bonus of</option>
  <option disabled={true}>Gives a skill point bonus of</option>
  <option disabled={true}>vies a spell level bonus of</option>
  <option disabled={true}>Gives a spell point bonus of</option>
  <option disabled={true}>Gives a weapon damage bonus of</option>
  <option disabled={true}>Reduces the attribute cost of</option>
</select>

<style>
</style>
