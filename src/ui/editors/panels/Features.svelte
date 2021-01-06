<script>
  import Boxes from "@ui/semantic-boxes/Boxes.svelte";
  import Box from "@ui/semantic-boxes/Box";

  import LocationOptions from "@ui/options/LocationOptions";
  import AttributeOptions from "@ui/options/AttributeOptions";
  import FeatureOptions from "@ui/options/FeatureOptions";
  import StringCompareOptions from "@ui/options/StringCompareOptions";

  import { FeatureBonusType } from "@internal";

  export let entity;
  export let features = [];

  function addFeature() {
    features = [...features, {}];
  }
  function removeFeature(i) {
    features = features.filter((feature, i1) => i !== i1);
  }
</script>

<style>
</style>

<div class="features-editor">
  <Boxes on:addbox={addFeature}>
    {#each features as feature, i (i)}
      <Box on:addbox={addFeature} on:deletebox={() => removeFeature(i)}>
        <div class="flex">
          <FeatureOptions bind:feature={feature.type} />
          <input
            type="number"
            placeholder="amount"
            bind:value={feature.amount} />
          <label>
            <span>Per Level</span>
            <input type="checkbox" bind:checked={feature.leveled} />
          </label>
        </div>
        {#if feature.type === FeatureBonusType.Attribute}
          <div class="flex">
            <AttributeOptions {entity} bind:attribute={feature.attribute} />
          </div>
        {:else if feature.type === FeatureBonusType.Skill}
          <div class="flex">
            <select>
              <option>to skills whose name</option>
            </select>
            <StringCompareOptions bind:option={feature.nameCompare} />
            <input
              type="text"
              placeholder="name"
              bind:value={feature.name}
            />
          </div>
          <div class="flex">
            <span>and whose specialization</span>
            <StringCompareOptions bind:option={feature.specializationCompare} />
            <input
              type="text"
              placeholder="specialization"
              bind:value={feature.specialization} />
          </div>
        {:else if feature.type === FeatureBonusType.Armor}
          <div class="flex">
            To Location(s)
            <span class="pl-1">
              <LocationOptions {entity} bind:location={feature.location} />
            </span>
          </div>
        {/if}
      </Box>
    {/each}
  </Boxes>
</div>
