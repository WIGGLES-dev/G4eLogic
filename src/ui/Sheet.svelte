<script>
  import { setContext, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";

  import ContextMenu from "@ui/context-menu/ContextMenu";
  import Tooltips from "@ui/tooltips/Tooltip";
  import Applications from "@ui/applications/ApplicationManager.svelte";
  import Notifications from "@ui/notifications/Notifications.svelte";

  import Traits from "@ui/layouts/dedicated/Traits";
  import Bio from "@ui/layouts/dedicated/Bio";
  import Skills from "@ui/layouts/dedicated/Skills";
  import Equipment from "@ui/layouts/dedicated/Equipment";
  import Settings from "@ui/layouts/dedicated/Settings";
  import General from "@ui/layouts/dedicated/General";
  import Grimoire from "@ui/layouts/dedicated/Grimoire";
  import Combat from "@ui/layouts/dedicated/Combat";

  import { Skill } from "@sheet/gurpsFeatures/index";
  import { Sheet } from "@sheet/feature";

  export let character = new Sheet();
  new Skill().mount(character.id);

  const ui = {
    contextMenu: null,
    modals: null,
    tooltips: null,
    notifications: null,
  };

  setContext("editor", {
    dispatch(event, detail) {
      dispatch(event, detail);
    },
    character,
    components: ui,
  });
</script>

<style>
</style>

<svelte:head>
  <link rel="stylesheet" href="test.css" />
  <link
    rel="stylesheet"
    href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
    integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
    crossorigin="anonymous" />
</svelte:head>

<ContextMenu bind:this={ui.contextMenu} />
<Applications bind:this={ui.modals} />
<Tooltips bind:this={ui.tooltips} />
<Notifications bind:this={ui.notifications} />

<div class="bg-white w-full overflow-auto">
  <Tabs>
    <TabList>
      <Tab>General</Tab>
      <Tab>Traits</Tab>
      <Tab>Bio</Tab>
      <Tab>Equipment</Tab>
      <Tab>Skills</Tab>
      <Tab>Grimoire</Tab>
      <Tab>Combat</Tab>
      <Tab><span class="fas fa-cogs" /></Tab>
    </TabList>
    <TabPanel component={General} />
    <TabPanel component={Traits} />
    <TabPanel component={Bio} />
    <TabPanel component={Equipment} />
    <TabPanel component={Skills} />
    <TabPanel component={Grimoire} />
    <TabPanel component={Combat} />
    <TabPanel component={Settings} />
  </Tabs>
</div>
