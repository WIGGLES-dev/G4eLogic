<script>
  import { Boxes, Box, Text, Number, Select, Option } from "@ui/index";
  import { FeatureType } from "@character/misc/feature";
  import { StringCompare } from "@utils/string_utils";

  export let entity = null;

  $: features = [...$entity.features];
</script>

<style>
</style>

<Boxes
  on:addbox={() => {
    entity.addFeature();
    console.log(entity);
  }}>
  {#each features as feature, i (feature.id)}
    <Box
      on:addbox={() => {
        entity.addFeature();
      }}
      on:deletebox={() => {
        feature.delete();
      }}>
      <div class="flex topmost">
        <Select bind:value={feature.type}>
          <Option value={FeatureType.attributeBonus}>
            Gives an attribute bonus of
          </Option>
          <Option disabled={true}>Gives a DR bonus of</Option>
          <Option disabled={true}>Gives a reaction modifier of</Option>
          <Option value={FeatureType.skillBonus}>
            Gives a skill level bonus of
          </Option>
          <Option disabled={true}>Gives a skill point bonus of</Option>
          <Option disabled={true}>vies a spell level bonus of</Option>
          <Option disabled={true}>Gives a spell point bonus of</Option>
          <Option disabled={true}>Gives a weapon damage bonus of</Option>
          <Option disabled={true}>Reduces the attribute cost of</Option>
        </Select>
        <Number bind:value={feature.amount} />
        <Select bind:value={feature.leveled}>
          <Option value={false} />
          <Option value={true}>per level</Option>
        </Select>
      </div>
      {#if feature.type === FeatureType.attributeBonus}
        <div class="flex">
          <Select bind:value={feature.attribute}>
            <Option value="ST">to ST</Option>
            <Option value="DX">to DX</Option>
            <Option value="IQ">to IQ</Option>
            <Option value="HT">to HT</Option>
          </Select>
          {#if ['ST', 'SS', 'LS'].includes(feature.attribute)}
            <Select bind:value={feature.attribute}>
              <Option value="ST" />
              <Option value="LS">for lifting only</Option>
              <Option value="SS">for striking only</Option>
            </Select>
          {/if}
        </div>
      {:else if feature.type === FeatureType.skillBonus}
        <div class="flex">
          <Select>
            <Option>to skills whose name</Option>
          </Select>
          <Select bind:value={feature.nameCompareType}>
            {#each Object.values(StringCompare) as compareType, i (i)}
              <Option value={compareType}>
                {compareType.split('_').join(' ')}
              </Option>
            {/each}
          </Select>
          <Text bind:value={feature.name} />
        </div>
        <div class="flex">
          <Select bind:value={feature.specializationCompareType}>
            {#each Object.values(StringCompare) as compareType, i (i)}
              <Option value={compareType}>
                specialization {compareType.split('_').join(' ')}
              </Option>
            {/each}
          </Select>
          <Text bind:value={feature.specialization} />
        </div>
      {/if}
    </Box>
  {/each}
</Boxes>
