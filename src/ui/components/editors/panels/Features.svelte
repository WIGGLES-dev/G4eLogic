<script>
  import { Boxes, Box, Text, Number, Select, Option } from "@ui/index";
  import { Features } from "@character/features/index";
  import { StringCompare } from "@utils/string_utils";
  import { LocationList } from "@character/locations";
  import { Configurer } from "@character/misc/config";

  export let entity = null;

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
          <option value={Features.DRBonus}>Gives a DR bonus of</option>
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
      {#if feature.type === Features.AttributeBonus}
        <div class="flex">
          <select bind:value={feature.core.attribute}>
            {#each [...feature
                .getCharacter()
                .attributeList.attributes.values()] as attribute, i (attribute.id)}
              <option value={attribute.signature}>to {attribute.name}</option>
            {/each}
          </select>
          {#if ['ST', 'SS', 'LS'].includes(feature.type.attribute)}
            <select bind:value={feature.type.attribute}>
              <option value="ST" />
              <option value="LS">for lifting only</option>
              <option value="SS">for striking only</option>
            </select>
          {/if}
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
      {:else if feature.type === Features.DRBonus}
        <div class="flex">
          To Location(s)
          <select name="" id="" bind:value={feature.core.location}>
            {#each [...feature
                .getCharacter()
                .locationList.locations.values()] as location, i (location.id)}
              {#if location.hasSubLocations}
                <optgroup label={location.name}>
                  <option value={location.name}>{location.name}</option>
                  {#each location.getSubLocations() as subLocation, i (subLocation.id)}
                    <option value={subLocation.name}>{subLocation.name}</option>
                  {/each}
                </optgroup>
              {/if}
            {/each}
          </select>
        </div>
      {/if}
    </Box>
  {/each}
</Boxes>
