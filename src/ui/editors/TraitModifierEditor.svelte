<script context="module" lang="ts">
  import { TraitModifierAffects, TraitModifierType } from "@internal";
  import { State } from "rxdeep";
  import { Tabs, TabList, Tab, TabPanel } from "@components/Tabs/tabs";
  import Features from "@ui/editors/panels/Features.svelte";
</script>

<script lang="ts">
  export let state$: State<any>;
  const features$ = state$.sub("features");
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
          <input type="text" bind:value={$state$.name} />
        </label>
        <label>
          <span>Enabled</span>
          <input type="checkbox" bind:checked={$state$.enabled} />
        </label>
      </fieldset>
      <fieldset>
        <label>
          <span>Cost</span>
          <input type="number" bind:value={$state$.cost} />
        </label>
        <label>
          <span>Mod Type</span>
          <select bind:value={$state$.type}>
            {#each Object.entries(TraitModifierType) as [key, value], i (i)}
              <option {value}>{key}</option>
            {/each}
          </select>
        </label>
        <label>
          <span>Levels</span>
          <input
            type="number"
            bind:value={$state$.level}
            disabled={!$state$.hasLevels ||
              $state$.type !== TraitModifierType.Percentage}
          />
        </label>
        <label>
          <span>Has Levels</span>
          <input
            type="checkbox"
            bind:checked={$state$.hasLevels}
            disabled={$state$.type !== TraitModifierType.Percentage}
          />
        </label>
        <label>
          <span>Affects</span>
          <select bind:value={$state$.affects}>
            {#each Object.entries(TraitModifierAffects) as [key, value], i (i)}
              <option {value}>{key}</option>
            {/each}
          </select>
        </label>
      </fieldset>
      <fieldset>
        <label class="flex-1">
          <span>Notes</span>
          <input type="text" bind:value={$state$.notes} />
        </label>
        <label>
          <span>Reference</span>
          <input type="text" bind:value={$state$.reference} />
        </label>
      </fieldset>
    </form>
  </TabPanel>
  <TabPanel>
    <Features bind:features={$features$} />
  </TabPanel>
</Tabs>

<style lang="postcss">
  input,
  select {
    @apply w-full bg-white;
  }
  label {
    @apply px-2;
  }
</style>
