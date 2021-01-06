<script lang='ts'>
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import CategoryList from "@components/Form/CategoryList.svelte";

  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";

  import Features from "./panels/Features.svelte";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import TraitModifiers from "./panels/TraitModifiers.svelte";

  import { ControlRating, Trait } from "@internal";

  export let id: string
  export let entity: Trait = new Trait({id, type: Trait.type});
  $: ({
    exists,
  } = entity);
  const enabled$ = entity.index.sub('enabled');
  const adjustedValue$ = entity.selectAdjustedPoints();
</script>

<style>
</style>

{#if exists}
  <Tabs>
    <TabList>
      <Tab>Trait Data</Tab>
      <Tab disabled={true}>Prerequisites</Tab>
      <Tab>Features</Tab>
      <Tab>Modifiers</Tab>
      <Tab>Melee Weapons</Tab>
      <Tab>Ranged Weapons</Tab>
      <Tab>User Description</Tab>
    </TabList>
    <TabPanel>
      <form>
        <fieldset>
          <label>
            <span>Name</span>
            <input type="text" bind:value={$entity.name} />
          </label>
        </fieldset>
        <fieldset>
          <label>
            <span>Points</span>
            <input
              type="number"
              bind:value={$entity.basePoints} />
          </label>
          <label>
            <span>Enabled</span>
            <input
              name='enabled'
              type="checkbox"
              bind:checked={$enabled$} />
          </label>
          <label >
            <span>CR</span>
            <select bind:value={$entity.controlRating}>
              {#each Object.entries(ControlRating) as [key, value], i (i)}
                <option {value}>
                  CR:{value.toString().toUpperCase()}({key
                    .split(/(?=[A-Z])/)
                    .join(' ')
                    .toLowerCase()})
                </option>
              {/each}
            </select>
          </label>
        </fieldset>
        <fieldset>
          <label>
            <span>Has</span>
            <select bind:value={$entity.hasLevels}>
              <option value={false}>No Levels</option>
              <option value={true}>Levels</option>
              <option disabled={true}>Half Levels</option>
            </select>
          </label>
          <label>
            <span>Level</span>
            <input
              type="number"
              bind:value={$entity.levels}
              disabled={!$entity.hasLevels} />
          </label>
          <label>
            <span>1/2</span>
            <input
              type="checkbox"
              bind:checked={$entity.hasHalfLevel}
              disabled />
          </label>
          <label>
            <span>Leveled Points</span>
            <input
              type="number"
              bind:value={$entity.pointsPerLevel}
              disabled={!$entity.hasLevels} />
          </label>
        </fieldset>
        <fieldset>
          <label >
            <span>Final Cost</span>
            <output>{$adjustedValue$}</output>
          </label>
          <CategoryList bind:categories={$entity.categories} />
          <label>
            <span>Reference</span>
            <input type="text" bind:value={$entity.reference} />
          </label>
        </fieldset>
      </form>
    </TabPanel>
    <TabPanel />
    <TabPanel>
      <Features {entity} bind:features={$entity.features} />
    </TabPanel>
    <TabPanel component={TraitModifiers} {entity} />
    <TabPanel component={MeleeWeapons} {entity} />
    <TabPanel component={RangedWeapons} {entity} />
    <TabPanel>
      <ProseMirror bind:content={$entity.userDescription} />
    </TabPanel>
  </Tabs>
{/if}
