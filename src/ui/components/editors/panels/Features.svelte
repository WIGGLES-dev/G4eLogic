<script>
  import { Boxes, Box, Text, Number, Select, Option } from "@ui/index";
  import { Features } from "@character/features/index";
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
      <div class="flex">
        <select bind:value={feature.type}>
          <option value={Features.AttributeBonus}>
            Gives an attribute bonus of
          </option>
          <option disabled={Features.DRBonus}>Gives a DR bonus of</option>
          <option disabled={true}>Gives a reaction modifier of</option>
          <option value={Features.SkillBonus}>
            Gives a skill level bonus of
          </option>
          <option disabled={true}>Gives a skill point bonus of</option>
          <option disabled={true}>vies a spell level bonus of</option>
          <option disabled={true}>Gives a spell point bonus of</option>
          <option disabled={true}>Gives a weapon damage bonus of</option>
          <option disabled={true}>Reduces the attribute cost of</option>
        </select>
        <input type="number" bind:value={feature.amount} />
        <select bind:value={feature.leveled}>
          <option value={false} />
          <option value={true}>per level</option>
        </select>
      </div>
      {#if feature.type instanceof Features.AttributeBonus}
        <div class="flex">
          <select bind:value={feature.type.attribute}>
            <option value="ST">to ST</option>
            <option value="DX">to DX</option>
            <option value="IQ">to IQ</option>
            <option value="HT">to HT</option>
          </select>
          {#if ['ST', 'SS', 'LS'].includes(feature.type.attribute)}
            <select bind:value={feature.type.attribute}>
              <option value="ST" />
              <option value="LS">for lifting only</option>
              <option value="SS">for striking only</option>
            </select>
          {/if}
        </div>
      {:else if feature.type instanceof Features.SkillBonus}
        <div class="flex">
          <select>
            <option>to skills whose name</option>
          </select>
          <select bind:value={feature.type.nameCompareType}>
            {#each Object.values(StringCompare) as compareType, i (i)}
              <option value={compareType}>
                {compareType.split('_').join(' ')}
              </option>
            {/each}
          </select>
          <input type="text" bind:value={feature.type.name} />
        </div>
        <div class="flex">
          <select bind:value={feature.type.specializationCompareType}>
            {#each Object.values(StringCompare) as compareType, i (i)}
              <option value={compareType}>
                specialization
                {compareType.split('_').join(' ')}
              </option>
            {/each}
          </select>
          <input type="text" bind:value={feature.type.specialization} />
        </div>
      {/if}
    </Box>
  {/each}
</Boxes>
