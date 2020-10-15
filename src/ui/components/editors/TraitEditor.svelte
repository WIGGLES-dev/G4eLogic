<script>
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";
  import { Tabs, Tab, TabPanel, TabList } from "@ui/index";

  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import TraitModifiers from "./panels/TraitModifiers.svelte";

  import { ControlRollMultiplier } from "@character/trait/trait";

  export let entity = null;

  function setCategories(e) {
    entity.categories = new Set(e.target.value.split(","));
    entity.dispatch();
  }
</script>

<style>
  label {
    @apply flex p-2;
  }

  div.flex label,
  input {
    @apply flex-1;
  }

  input,
  select {
    @apply border-b border-black border-solid outline-none ml-1;
  }

  input {
    @apply h-full pl-1;
  }

  textarea {
    @apply outline-none border border-black border-solid rounded mt-2 w-full;
  }
</style>

<Tabs>
  <TabList>
    <Tab index={0}>Trait Data</Tab>
    <Tab index={1}>Defaults</Tab>
    <Tab index={2}>Prerequisites</Tab>
    <Tab index={3}>Features</Tab>
    <Tab index={4}>Modifiers</Tab>
    <Tab index={5}>MeleeWeapons</Tab>
    <Tab index={6}>RangedWeapons</Tab>
    <Tab index={7}>User Description</Tab>
  </TabList>
  <TabPanel>
    <form action="" class="p-3">
      <div class="flex">
        <label for="">Points<input
            type="number"
            bind:value={$entity.basePoints} /></label>
        <label for="">Disabled<input
            type="checkbox"
            bind:checked={$entity.disabled} /></label>

        <label for="">
          CR
          <select bind:value={$entity.controlRating}>
            {#each Object.entries(ControlRollMultiplier) as [key, value], i (i)}
              <option {value}>
                CR:{value.toUpperCase()}({key
                  .split(/(?=[A-Z])/)
                  .join(' ')
                  .toLowerCase()})
              </option>
            {/each}
          </select>
        </label>
      </div>

      <div class="flex">
        <select bind:value={$entity.hasLevels}>
          <option value={false}>Has No Levels</option>
          <option value={true}>Has Levels</option>
          <option disabled={true}>Has Half Levels</option>
        </select>
        <label for="">Level<input
            type="number"
            bind:value={$entity.levels}
            disabled={!$entity.hasLevels} /></label>
        <label for="">+1/2
          <input
            type="checkbox"
            bind:checked={$entity.hasHalfLevel}
            disabled /></label>

        <label for="">Leveled Points
          <input
            type="number"
            bind:value={$entity.pointsPerLevel}
            disabled={!$entity.hasLevels} /></label>
      </div>

      <div class="flex">
        <label for="">
          Final Cost
          <input type="number" value={$entity.adjustedPoints()} disabled />
        </label>

        <label for="">Categories
          <input
            on:change={setCategories}
            type="text"
            value={[...$entity.categories].join(', ')} /></label>

        <label for="">Reference
          <input type="text" bind:value={$entity.reference} /></label>
      </div>
      <label for="">Notes </label>
      <textarea bind:value={$entity.notes} name="" id="" rows="3" />
    </form>
  </TabPanel>
  <TabPanel />
  <TabPanel />
  <TabPanel component={Features} props={{ entity }} />
  <TabPanel component={TraitModifiers} props={{ entity }} />
  <TabPanel component={MeleeWeapons} props={{ entity }} />
  <TabPanel component={RangedWeapons} props={{ entity }} />
  <TabPanel />
</Tabs>
