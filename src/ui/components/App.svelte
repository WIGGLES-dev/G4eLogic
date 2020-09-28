<script>
  import { setContext, onMount } from "svelte";
  import { Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import Traits from "@ui/components/layouts/dedicated/Traits";
  import Equipment from "@ui/components/layouts/dedicated/Equipment";
  import Settings from "@ui/components/layouts/dedicated/Settings";

  import General from "@ui/components/layouts/General";

  import ContextMenu from "@ui/components/context-menu/ContextMenu";
  import Modals from "@ui/components/dialog/Modals.svelte";

  import List from "@ui/components/lists/List";

  import Skill from "@ui/components/entities/Skill";
  import SkillEditor from "@ui/components/editors/SkillEditor";

  export let character = null;

  let contextMenu;
  let modals;

  const components = {};

  onMount(() => {
    Object.assign(components, {
      contextMenu,
      modals,
    });
  });

  setContext("app", {
    components,
    character,
  });

  let skillList = character.skillList;

  character.Hooks.on(`generate skill list`, (list) => {
    skillList = list;
  });
</script>

<style>
</style>

<ContextMenu bind:this={contextMenu} />
<Modals bind:this={modals} />

<div class="flex" style="padding-bottom: 3px;">
  <span class="tool fas fa-undo" on:click={character.State.undo()} />
  <span class="tool fas fa-redo" on:click={character.State.redo()} />
</div>

<Tabs>
  <TabList>
    <Tab>General</Tab>
    <Tab>Traits</Tab>
    <Tab>Equipment</Tab>
    <Tab>Skills</Tab>
    <Tab>Grimoire</Tab>
    <Tab>Combat</Tab>
    <Tab><span class="fas fa-cogs" /></Tab>
  </TabList>
  <TabPanel component={General} />
  <TabPanel component={Traits} />
  <TabPanel component={Equipment} />
  <TabPanel>
    <List
      title="Skill"
      component={Skill}
      editor={SkillEditor}
      list={skillList.contents.arr}
      display="table">
      <tr slot="header">
        <th>Skill</th>
        <th>SL</th>
        <th>RSL</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </TabPanel>
  <TabPanel />
  <TabPanel />
  <TabPanel component={Settings} />
</Tabs>
