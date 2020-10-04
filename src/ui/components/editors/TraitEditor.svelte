<script>
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";
  import { Tabs, Tab, TabPanel, TabList } from "@ui/index";

  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import TraitModifiers from "./panels/TraitModifiers.svelte";

  import { ControlRollMultiplier } from "@character/trait/trait";

  export let entity = null;

  $: entityName = $entity.constructor.name;
</script>

<style>
</style>

<Tabs>
  <TabList>
    <Tab index={0}>{entityName} Data</Tab>
    <Tab index={1}>Defaults</Tab>
    <Tab index={2}>Prerequisites</Tab>
    <Tab index={3}>Features</Tab>
    <Tab index={4}>Modifiers</Tab>
    <Tab index={5}>MeleeWeapons</Tab>
    <Tab index={6}>RangedWeapons</Tab>
    <Tab index={7}>User Description</Tab>
  </TabList>
  <TabPanel>
    <Text bind:value={$entity.name}>Name:</Text>
    <Checkbox bind:checked={$entity.disabled}>Disabled:</Checkbox>
    <Number bind:value={$entity.basePoints}>Base Points Cost:</Number>
    <Select bind:value={$entity.hasLevels}>
      <Option value={false}>Has No Levels</Option>
      <Option value={true}>Has Levels</Option>
      <Option disabled={true}>Has Half Levels</Option>
    </Select>
    <Number bind:value={$entity.levels} disabled={!$entity.hasLevels}>
      Level:
    </Number>
    <Checkbox bind:checked={$entity.hasHalfLevel} disabled={true}>
      +1/2
    </Checkbox>
    <Number bind:value={$entity.pointsPerLevel} disabled={!$entity.hasLevels}>
      Point Cost Per Level
    </Number>
    <Text bind:value={$entity.notes}>Notes:</Text>
    <Text bind:value={$entity.categories}>Categories:</Text>
    <Number value={$entity.adjustedPoints()} disabled={true}>
      Final Cost:
    </Number>
    <Select bind:value={$entity.controlRating}>
      {#each Object.entries(ControlRollMultiplier) as [key, value], i (i)}
        <Option {value}>
          CR:{value.toUpperCase()}({key
            .split(/(?=[A-Z])/)
            .join(' ')
            .toLowerCase()})
        </Option>
      {/each}
    </Select>
    <Text bind:value={$entity.reference}>Reference:</Text>
  </TabPanel>
  <TabPanel />
  <TabPanel />
  <TabPanel component={Features} props={{ entity }} />
  <TabPanel component={TraitModifiers} props={{ entity }} />
  <TabPanel component={MeleeWeapons} props={{ entity }} />
  <TabPanel component={RangedWeapons} props={{ entity }} />
  <TabPanel />
</Tabs>
