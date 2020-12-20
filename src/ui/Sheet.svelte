<script>
  import { setContext } from "svelte";
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";

  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";

  import Traits from "@ui/layouts/dedicated/Traits.svelte";
  import Bio from "@ui/layouts/dedicated/Bio.svelte";
  import Skills from "@ui/layouts/dedicated/Skills.svelte";
  import Equipment from "@ui/layouts/dedicated/Equipment.svelte";
  import Settings from "@ui/layouts/dedicated/Settings.svelte";
  import General from "@ui/layouts/dedicated/General.svelte";
  import Grimoire from "@ui/layouts/dedicated/Grimoire.svelte";
  import Combat from "@ui/layouts/dedicated/Combat.svelte";

  import { Registry } from "@internal";

  export let id;
  export let type;

  const cast = Registry.classes.get(type);
  const sheet = new cast({ id, type });
  console.log(sheet);
  setContext("sheet", sheet);
</script>

<style>
  .valor-sheet-editor {
    @apply bg-white w-full;
  }
</style>

<svelte:head />

<section class="valor-sheet-editor">
  {#if sheet.exists}
    <Tabs bind:tabIndex={$sheet.activeTab}>
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
        <ProseMirror bind:content={$sheet.notes} />
      </TabPanel>
      <TabPanel component={Grimoire} />
      <TabPanel component={Settings} />
    </Tabs>
  {/if}
</section>
