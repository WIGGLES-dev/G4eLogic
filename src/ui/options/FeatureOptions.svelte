<script>
  const Features = {};
  export let feature;
</script>

<style>
</style>

<select name="" id="" bind:value={feature}>
  <option value="" />
  <option value={Features.AttributeBonus}>Gives an attribute bonus of</option>
  <option value={Features.Armor}>Gives a DR bonus of</option>
  <option disabled={true}>Gives a reaction modifier of</option>
  <option value={Features.SkillBonus}>Gives a skill level bonus of</option>
  <option disabled={true}>Gives a skill point bonus of</option>
  <option disabled={true}>vies a spell level bonus of</option>
  <option disabled={true}>Gives a spell point bonus of</option>
  <option disabled={true}>Gives a weapon damage bonus of</option>
  <option disabled={true}>Reduces the attribute cost of</option>
</select>
