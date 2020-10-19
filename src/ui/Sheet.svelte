<script>
  import { Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import Traits from "@ui/layouts/dedicated/Traits";
  import Bio from "@ui/layouts/dedicated/Bio";
  import Skills from "@ui/layouts/dedicated/Skills";
  import Equipment from "@ui/layouts/dedicated/Equipment";
  import Settings from "@ui/layouts/dedicated/Settings";
  import General from "@ui/layouts/dedicated/General";
  import Grimoire from "@ui/layouts/dedicated/Grimoire";
  import Combat from "@ui/layouts/dedicated/Combat";
</script>

<style>
  div {
    overflow: auto;
  }
</style>

<div class="bg-white w-full">
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
