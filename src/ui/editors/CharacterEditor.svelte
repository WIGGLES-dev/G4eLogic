<script context="module" lang="ts">
  import { setContext } from "svelte";
  import { State } from "rxdeep";
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
  import { System } from "@internal";
</script>

<script lang="ts">
  import { mergeMap } from "rxjs/operators";
  import { from, using } from "rxjs";
  import { releaseProxy } from "comlink";
  import { withComlinkProxy } from "@app/utils/operators";
  export let entity: State<CharacterData>;
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
    <Tab>Settings</Tab>
  </TabList>
  <TabPanel component={General} />
  <TabPanel component={Combat} />
  <TabPanel component={Skills} />
  <TabPanel component={Equipment} />
  <TabPanel component={Traits} />
  <TabPanel component={Bio} />
  <TabPanel>
    <ProseMirror bind:content={$entity["notes"]} />
  </TabPanel>
  <TabPanel component={Grimoire} />
  <TabPanel component={Settings} />
</Tabs>

<style>
</style>
