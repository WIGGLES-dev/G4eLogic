<script>
  import Boxes from "@ui/semantic-boxes/Boxes.svelte";
  import Box from "@ui/semantic-boxes/Box";

  import LocationOptions from "@ui/options/LocationOptions";
  import AttributeOptions from "@ui/options/AttributeOptions";
  import FeatureOptions from "@ui/options/FeatureOptions";
  import StringCompareOptions from "@ui/options/StringCompareOptions";

  import { FeatureBonusType } from "@sheet/keys";

  export let entity;
  $: features = $entity.keys.bonuses;

  function addFeature() {
    entity.pathUpdate(`keys.bonuses`, [...features, {}]);
  }
  function removeFeature(i) {
    entity.pathUpdate(
      `keys.bonuses`,
      features.filter((feature, i1) => i !== i1)
    );
  }
</script>

<style>
  input,
  select {
    @apply border-b border-solid border-black;
  }
</style>

<Boxes on:addbox={addFeature}>
  {#each features as feature, i (i)}
    <Box on:addbox={addFeature} on:deletebox={() => removeFeature(i)}>
      <div class="flex">
        <FeatureOptions bind:feature={$entity.keys.bonuses[i].type} />
        <input
          type="number"
          placeholder="amount"
          bind:value={$entity.keys.bonuses[i].amount} />
        <select bind:value={$entity.keys.bonuses[i].leveled}>
          <option value={false} />
          <option value={true}>per level</option>
        </select>
      </div>
      {#if feature.type === FeatureBonusType.Attribute}
        <div class="flex">
          <AttributeOptions
            {entity}
            bind:attribute={$entity.keys.bonuses[i].attribute} />
        </div>
      {:else if feature.type === FeatureBonusType.Skill}
        <div class="flex">
          <select>
            <option>to skills whose name</option>
          </select>
          <StringCompareOptions
            bind:option={$entity.keys.bonuses[i].nameCompare} />
          <input
            type="text"
            placeholder="name"
            bind:value={$entity.keys.bonuses[i].nameCriteria} />
        </div>
        <div class="flex">
          <span>and whose specialization</span>
          <StringCompareOptions
            bind:option={$entity.keys.bonuses[i].specializationCompare} />
          <input
            type="text"
            placeholder="specialization"
            bind:value={$entity.keys.bonuses[i].specializationCriteria} />
        </div>
      {:else if feature.type === FeatureBonusType.Armor}
        <div class="flex">
          To Location(s)
          <span class="pl-1">
            <LocationOptions
              {entity}
              bind:location={$entity.keys.bonuses[i].location} />
          </span>
        </div>
      {/if}
    </Box>
  {/each}
</Boxes>
