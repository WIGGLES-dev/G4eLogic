<script context="module" lang="ts">
  import CategoryList from "@components/Form/CategoryList.svelte";
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import AttributeOptions from "@ui/options/AttributeOptions.svelte";
  import DifficultyOptions from "@ui/options/DifficultyOptions.svelte";
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import Features from "./panels/Features.svelte";
  import DataTable from "@ui/DataTable.svelte";
  import SkillDefaults from "./panels/SkillDefaults.svelte";
</script>

<script lang="ts">
  export let entity;
  const { level$ } = entity;
  const features$ = entity.sub("features");
</script>

<Tabs>
  <TabList>
    <Tab>Data</Tab>
    <Tab disabled="{true}">Prerequisites</Tab>
    <Tab>Features</Tab>
    <Tab>MeleeWeapons</Tab>
    <Tab>RangedWeapons</Tab>
    <Tab>User Description</Tab>
  </TabList>
  <TabPanel>
    <form>
      <fieldset>
        <label>
          <span>Name</span>
          <input
            name="name"
            class="flex-1"
            type="text"
            bind:value="{$entity.name}"
          />
        </label>
        <label>
          <span>Specialization</span>
          <input type="text" bind:value="{$entity.specialization}" />
        </label>
      </fieldset>
      <fieldset>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <span>Defaults To</span>
          <AttributeOptions
            signaturesOnly="{true}"
            bind:attribute="{$entity.default.type}"
          >
            <option value="Skill">Skill Named</option>
          </AttributeOptions>
        </label>
      </fieldset>
      <fieldset>
        {#if $entity.default.type === "Skill"}
          <label>
            <input
              type="text"
              bind:value="{$entity.default.name}"
              placeholder="Name"
            />
          </label>
          <label>
            <input
              type="text"
              bind:value="{$entity.default.specialization}"
              placeholder="Specialization"
            />
          </label>
        {/if}
        <label>
          <input
            type="number"
            bind:value="{$entity.default.modifier}"
            placeholder="Modifier"
          />
        </label>
        <label>
          <span>Limit</span>
          <input type="number" bind:value="{$entity.limit}" />
        </label>
      </fieldset>
      <fieldset>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <span>Difficulty</span>
          <DifficultyOptions
            technique="{true}"
            bind:difficulty="{$entity.difficulty}"
          />
        </label>
        <label>
          <span>Points</span>
          <input type="number" bind:value="{$entity.points}" />
        </label>
        <label>
          <span>Final Level</span>
          <output>{Math.floor($level$)}</output>
        </label>
        <label>
          <span>Disabled</span>
          <input type="checkbox" bind:checked="{$entity.disabled}" />
        </label>
      </fieldset>
      <fieldset>
        <CategoryList bind:categories="{$entity.categories}" />
        <label>
          <span>Reference</span>
          <input type="number" bind:value="{$entity.reference}" />
        </label>
      </fieldset>
      <label>
        <span>Notes</span>
        <textarea bind:value="{$entity.notes}" name="" id="" rows="3"
        ></textarea>
      </label>
    </form>
  </TabPanel>
  <TabPanel />
  <TabPanel>
    <Features bind:features="{$features$}" />
  </TabPanel>
  <TabPanel>
    <DataTable type="melee weapon" rootId="{$entity.id}" />
  </TabPanel>
  <TabPanel>
    <DataTable type="ranged weapon" rootId="{$entity.id}" />
  </TabPanel>
  <TabPanel>
    <ProseMirror bind:content="{$entity.userDescription}" />
  </TabPanel>
</Tabs>

<style>
</style>
