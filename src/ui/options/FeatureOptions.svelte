<script lang="ts">
  import { FeatureBonusType } from "@internal";
  export let feature: FeatureBonusType;
</script>

<style>
</style>

<select bind:value={feature}>
  <option value={undefined} />
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
