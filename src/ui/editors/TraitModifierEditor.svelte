<script context="module" lang="ts">
  import {
    TraitModifierAffects,
    TraitModifierType,
  } from "@app/gurps/resources/trait";
  import { State } from "rxdeep";
  import { Tabs, TabList, Tab, TabPanel } from "@components/Tabs/tabs";
  import Features from "@ui/editors/panels/Features.svelte";
</script>

<script lang="ts">
  export let entity: State<any>;
  const features$ = entity.sub("features");
</script>

<Tabs>
  <TabList>
    <Tab>Modifier Data</Tab>
    <Tab>Features</Tab>
  </TabList>
  <TabPanel>
    <form class="children:flex p-3">
      <fieldset>
        <label class="flex-1">
          <span>Name</span>
          <input type="text" bind:value={$entity.name} />
        </label>
        <label>
          <span>Enabled</span>
          <input type="checkbox" bind:checked={$entity.enabled} />
        </label>
      </fieldset>
      <fieldset>
        <label>
          <span>Cost</span>
          <input type="number" bind:value={$entity.cost} />
        </label>
        <label>
          <span>Mod Type</span>
          <select bind:value={$entity.costType}>
            {#each Object.entries(TraitModifierType) as [key, value], i (i)}
              <option {value}>{key}</option>
            {/each}
          </select>
        </label>
        <label>
          <span>Levels</span>
          <input
            type="number"
            bind:value={$entity.level}
            disabled={!$entity.hasLevels ||
              $entity.type !== TraitModifierType.Percentage}
          />
        </label>
        <label>
          <span>Has Levels</span>
          <input
            type="checkbox"
            bind:checked={$entity.hasLevels}
            disabled={$entity.costType !== TraitModifierType.Percentage}
          />
        </label>
        <label>
          <span>Affects</span>
          <select bind:value={$entity.affects}>
            {#each Object.entries(TraitModifierAffects) as [key, value], i (i)}
              <option {value}>{key}</option>
            {/each}
          </select>
        </label>
      </fieldset>
      <fieldset>
        <label class="flex-1">
          <span>Notes</span>
          <input type="text" bind:value={$entity.notes} />
        </label>
        <label>
          <span>Reference</span>
          <input type="text" bind:value={$entity.reference} />
        </label>
      </fieldset>
    </form>
  </TabPanel>
  <TabPanel>
    <Features bind:features={$features$} />
  </TabPanel>
</Tabs>

<style lang="postcss">
</style>
