<script>
  import {
    Tabs,
    Tab,
    TabPanel,
    TabList,
    Number,
    Text,
    Checkbox,
  } from "@ui/index";
  export let entity = null;

  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import EquipmentModifiers from "./panels/EquipmentModifiers.svelte";

  let entityName = $entity.constructor.name;
</script>

<style>
</style>

<Tabs>
  <TabList>
    <Tab>{entityName} Data</Tab>
    <Tab>Features</Tab>
    <Tab>Modifiers</Tab>
    <Tab>MeleeWeapons</Tab>
    <Tab>RangedWeapons</Tab>
    <Tab>User Description</Tab>
  </TabList>
  <TabPanel>
    <Text bind:value={$entity.name}>Name:</Text>
    <Checkbox bind:checked={$entity.equipped}>Equipped:</Checkbox>
    <Number bind:value={$entity.quantity}>Quantity:</Number>
    <Text bind:value={$entity.techLevel}>Tech Level:</Text>
    <Number bind:value={$entity.weight}>Weight:</Number>
    <Number bind:value={$entity.value}>Value:</Number>
    <Checkbox bind:value={$entity.applySkillEncumbrancePenalty}>
      Ignore for Skills
    </Checkbox>
    <Text bind:value={$entity.notes}>Notes:</Text>
    <Text bind:value={$entity.categories}>Categories:</Text>
    <Number bind:value={$entity.uses}>Uses:</Number>
    <Number bind:value={$entity.maxUses}>Max Uses:</Number>
    <Text bind:value={$entity.reference}>Reference:</Text>
  </TabPanel>
  <TabPanel component={Features} props={{ entity }} />
  <TabPanel component={EquipmentModifiers} props={{ entity }} />
  <TabPanel component={MeleeWeapons} props={{ entity }} />
  <TabPanel component={RangedWeapons} props={{ entity }} />
  <TabPanel />
</Tabs>
