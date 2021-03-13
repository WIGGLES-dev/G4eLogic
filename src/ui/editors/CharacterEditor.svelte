<script context="module" lang="ts">
  import { setContext } from "svelte";
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import Traits from "@ui/layouts/Traits.svelte";
  import Bio from "@ui/layouts/Bio.svelte";
  import Skills from "@ui/layouts/Skills.svelte";
  import Equipment from "@ui/layouts/Equipment.svelte";
  import Settings from "@ui/layouts/Settings.svelte";
  import General from "@ui/layouts/General.svelte";
  import Grimoire from "@ui/layouts/Grimoire.svelte";
  import Combat from "@ui/layouts/Combat.svelte";
  import { System, Character } from "@internal";
</script>

<script lang="ts">
  export let entity: Character;
  setContext("sheet", entity);
</script>

<Tabs>
  <TabList>
    <Tab>General</Tab>
    <Tab>Combat</Tab>
    <Tab>Skills</Tab>
    <Tab>Equipment</Tab>
    <Tab>Traits</Tab>
    <Tab>Bio</Tab>
    <Tab>Notes</Tab>
    <Tab>Grimoire</Tab>
    <Tab><span class="fas fa-cogs" /></Tab>
  </TabList>
  <TabPanel component={General} />
  <TabPanel component={Combat} />
  <TabPanel component={Skills} />
  <TabPanel component={Equipment} />
  <TabPanel component={Traits} />
  <TabPanel component={Bio} />
  <TabPanel>
    <ProseMirror bind:content={$entity.notes} />
  </TabPanel>
  <TabPanel component={Grimoire} />
  <TabPanel component={Settings} />
</Tabs>

<style>
</style>
