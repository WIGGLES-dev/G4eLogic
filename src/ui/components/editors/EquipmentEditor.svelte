<script>
  import { Tabs, Tab, TabPanel, TabList } from "@ui/index";
  export let entity = null;

  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  $: entityName = $entity.constructor.name;
</script>

<style>
</style>

<Tabs>
  <TabList>
    <Tab index={0}>{entityName} Data</Tab>
    <Tab index={1}>Features</Tab>
    <Tab index={2}>MeleeWeapons</Tab>
    <Tab index={3}>RangedWeapons</Tab>
    <Tab index={4}>User Description</Tab>
  </TabList>
  <TabPanel>fdas</TabPanel>
  <TabPanel component={Features} props={{ entity }} />
  <TabPanel component={MeleeWeapons} props={{ entity }} />
  <TabPanel />
  <TabPanel />
</Tabs>
