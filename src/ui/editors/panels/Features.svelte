<script lang="ts">
  import Boxes from "@components/semantic-boxes/Boxes.svelte";
  import Box from "@components/semantic-boxes/Box.svelte";

  import LocationOptions from "@ui/options/LocationOptions.svelte";
  import AttributeOptions from "@ui/options/AttributeOptions.svelte";
  import FeatureOptions from "@ui/options/FeatureOptions.svelte";
  import StringCompareOptions from "@ui/options/StringCompareOptions.svelte";

  import { FeatureBonusType } from "@app/gurps/resources/interfaces";
  export let features = [];
  $: if (!Array.isArray(features)) {
    features = [];
  }
  function addFeature() {
    features = [...features, {}];
  }
  function removeFeature(i) {
    features = features.filter((feature, i1) => i !== i1);
  }
  $: showInitialAdder = features && features.length === 0;
</script>

<section class="features-editor">
  <Boxes on:addbox={addFeature} {showInitialAdder}>
    {#each features as feature, i (i)}
      <Box on:addbox={addFeature} on:deletebox={() => removeFeature(i)}>
        <div class="flex flex-col">
          <fieldset>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>
              <FeatureOptions bind:feature={feature.type} />
            </label>
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
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label>
                <span>To Attribute(s)</span>
                <AttributeOptions bind:attribute={feature.attribute} />
              </label>
            </fieldset>
          {:else if feature.type === FeatureBonusType.Skill}
            <fieldset>
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label>
                <span>whose name</span>
                <StringCompareOptions bind:option={feature.nameCompare} />
              </label>
              <label>
                <input
                  type="text"
                  placeholder="name"
                  bind:value={feature.name}
                />
              </label>
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
                <LocationOptions bind:location={feature.location} />
              </label>
            </fieldset>
          {/if}
        </div>
      </Box>
    {/each}
  </Boxes>
</section>

<style lang="postcss">
  .features-editor :global(li) {
    @apply bg-gray-400;
  }
  label {
    @apply bg-white m-2 p-1;
  }
  fieldset {
    @apply flex;
  }
</style>
