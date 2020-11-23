<script>
  import { setContext, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";

  import ProseMirror from "@ui/prosemirror/ProseMirror";

  import Traits from "@ui/layouts/dedicated/Traits";
  import Bio from "@ui/layouts/dedicated/Bio";
  import Skills from "@ui/layouts/dedicated/Skills";
  import Equipment from "@ui/layouts/dedicated/Equipment";
  import Settings from "@ui/layouts/dedicated/Settings";
  import General from "@ui/layouts/dedicated/General";
  import Grimoire from "@ui/layouts/dedicated/Grimoire";
  import Combat from "@ui/layouts/dedicated/Combat";

  import { Sheet } from "@internal";
  export let id;
  export let editor = null;

  const character = new Sheet(id);

  setContext("editor", {
    globalDispatch(event, detail) {
      dispatch(event, detail);
    },
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
