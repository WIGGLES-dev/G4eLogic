<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
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

  import { Sheet } from "@internal";

  export let id;
  export let editor = null;

  const character = new Sheet(id);
  console.log(character);

  setContext("editor", {
    character,
    editor,
  });
</script>

<style>
  .valor-sheet-editor {
    @apply bg-white w-full;
  }
</style>

<svelte:head />

<section class="valor-sheet-editor">
  {#if character.exists}
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
        <ProseMirror bind:content={$character.notes} />
      </TabPanel>
      <TabPanel component={Grimoire} />
      <TabPanel component={Settings} />
    </Tabs>
  {/if}
</section>
