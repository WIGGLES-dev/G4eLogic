<script>
  import { Tabs, Tab, TabPanel, TabList } from "@ui/index";
  export let entity = null;

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
  </TabList>
</Tabs>