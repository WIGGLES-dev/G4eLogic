<script>
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";
  import Form from "@ui/form/Form";
  import CategoryList from "@ui/form/CategoryList";

  import ProseMirror from "@ui/prosemirror/ProseMirror";

  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import TraitModifiers from "./panels/TraitModifiers.svelte";

  import { ControlRating as ControlRollMultiplier } from "@internal";

  export let entity = null;
  const { adjustedValue$ } = entity;
</script>

<style>
</style>

{#if entity.exists}
  <Tabs>
    <TabList>
      <Tab>Trait Data</Tab>
      <Tab disabled={true}>Prerequisites</Tab>
      <Tab>Features</Tab>
      <Tab disabled={true}>Modifiers</Tab>
      <Tab>Melee Weapons</Tab>
      <Tab>Ranged Weapons</Tab>
      <Tab>User Description</Tab>
    </TabList>
    <TabPanel>
      <Form>
        <label for="">Name
          <input type="text" bind:value={$entity.name} /></label>
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
                <option value={undefined} />
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
            <input type="number" value={$adjustedValue$} disabled />
          </label>

          <CategoryList bind:categories={$entity.categories} />

          <label for="">Reference
            <input type="text" bind:value={$entity.reference} /></label>
        </div>
        <label for="">Notes </label>
        <textarea bind:value={$entity.notes} name="" id="" rows="3" />
      </Form>
    </TabPanel>
    <TabPanel />
    <TabPanel>
      <Features {entity} bind:features={$entity.bonuses} />
    </TabPanel>
    <TabPanel component={TraitModifiers} {entity} />
    <TabPanel component={MeleeWeapons} {entity} />
    <TabPanel component={RangedWeapons} {entity} />
    <TabPanel>
      <ProseMirror bind:content={$entity.userDescription} />
    </TabPanel>
  </Tabs>
{/if}
