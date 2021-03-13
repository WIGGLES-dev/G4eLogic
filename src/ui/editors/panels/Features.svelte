<script>
  import Boxes from "@components/semantic-boxes/Boxes.svelte";
  import Box from "@components/semantic-boxes/Box";

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

<div class="features-editor">
  <Boxes on:addbox={addFeature}>
    {#each features as feature, i (i)}
      <Box on:addbox={addFeature} on:deletebox={() => removeFeature(i)}>
        <fieldset>
          <FeatureOptions bind:feature={feature.type} />
          <label>
            <input
              type="number"
              placeholder="amount"
              bind:value={feature.amount}
            />
          </label>
          <label>
            <span>Per Level</span>
            <input type="checkbox" bind:checked={feature.leveled} />
          </label>
        </fieldset>
        {#if feature.type === FeatureBonusType.Attribute}
          <fieldset>
            <AttributeOptions {entity} bind:attribute={feature.attribute} />
          </fieldset>
        {:else if feature.type === FeatureBonusType.Skill}
          <fieldset>
            <select>
              <option>to skills whose name</option>
            </select>
            <StringCompareOptions bind:option={feature.nameCompare} />
            <input type="text" placeholder="name" bind:value={feature.name} />
          </fieldset>
          <fieldset>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>
              <span>and whose specialization</span>
              <StringCompareOptions
                bind:option={feature.specializationCompare}
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="specialization"
                bind:value={feature.specialization}
              />
            </label>
          </fieldset>
        {:else if feature.type === FeatureBonusType.Armor}
          <fieldset>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>
              <span> To Location(s)</span>
              <LocationOptions {entity} bind:location={feature.location} />
            </label>
          </fieldset>
        {/if}
      </Box>
    {/each}
  </Boxes>
</div>

<style lang="postcss">
  fieldset {
    @apply flex;
  }
</style>
