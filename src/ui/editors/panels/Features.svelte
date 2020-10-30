<script>
  import Boxes from "@ui/semantic-boxes/Boxes.svelte";
  import Box from "@ui/semantic-boxes/Box";

  import LocationOptions from "@ui/options/LocationOptions";
  import AttributeOptions from "@ui/options/AttributeOptions";
  import FeatureOptions from "@ui/options/FeatureOptions";
  import { StringCompare } from "@utils/strings";

  export let entity;

  const Features = {};

  $: features = [...entity.features];
</script>

<style>
  input,
  select {
    @apply border-b border-solid border-black;
  }
</style>

<Boxes
  on:addbox={() => {
    entity.addFeature();
  }}>
  {#each features as feature, i (feature.id)}
    <Box
      on:addbox={() => {
        entity.addFeature();
      }}
      on:deletebox={() => {
        feature.delete();
      }}>
      <div class="flex">
        <FeatureOptions bind:feature={feature.type} />
        <input type="number" bind:value={feature.amount} />
        <select bind:value={feature.leveled}>
          <option value={false} />
          <option value={true}>per level</option>
        </select>
      </div>
      {#if feature.type === Features.AttributeBonus}
        <div class="flex">
          <AttributeOptions {entity} bind:attribute={feature.core.attribute} />
        </div>
      {:else if feature.type === Features.SkillBonus}
        <div class="flex">
          <select>
            <option>to skills whose name</option>
          </select>
          <select bind:value={feature.core.nameCompareType}>
            {#each Object.values(StringCompare) as compareType, i (i)}
              <option value={compareType}>
                {compareType.split('_').join(' ')}
              </option>
            {/each}
          </select>
          <input type="text" bind:value={feature.core.name} />
        </div>
        <div class="flex">
          <select bind:value={feature.core.specializationCompareType}>
            {#each Object.values(StringCompare) as compareType, i (i)}
              <option value={compareType}>
                specialization
                {compareType.split('_').join(' ')}
              </option>
            {/each}
          </select>
          <input type="text" bind:value={feature.core.specialization} />
        </div>
      {:else if feature.type === Features.Armor}
        <div class="flex">
          To Location(s)
          <span class="pl-1"><LocationOptions
              {entity}
              bind:location={feature.core.location} /></span>
        </div>
      {/if}
    </Box>
  {/each}
</Boxes>
