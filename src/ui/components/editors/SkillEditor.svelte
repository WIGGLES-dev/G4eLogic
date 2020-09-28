<script>
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";
  import { Tabs, Tab, TabPanel, TabList } from "@ui/index";
  import Features from "./panels/Features";

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
    <Tab index={4}>MeleeWeapons</Tab>
    <Tab index={5}>RangedWeapons</Tab>
    <Tab index={6}>User Description</Tab>
  </TabList>
  <TabPanel>
    <div class="flex-col">
      <Text bind:value={$entity.name}>Name:</Text>
      <Checkbox bind:checked={$entity.disabled}>Disabled:</Checkbox>
      <Text bind:value={$entity.specialization}>Specialization:</Text>
      <Checkbox bind:checked={$entity.hasTechLevel}>Has Tech Level:</Checkbox>
      <Text bind:value={$entity.techLevel} disabled={!$entity.hasTechLevel}>
        Tech Level:
      </Text>
      <Select bind:value={$entity.encumbrancePenaltyMultiple}>
        <span slot="label">Encumbrance Penalty Multiple: </span>
        <Option value={0}>No penalty due to encumbrance</Option>
        <Option value={1}>Penalty equal to the encumbrance level</Option>
        {#each new Array(7) as encumbranceMultiple, i (i)}
          <Option value={i}>
            Penalty equal to {i} times the current encumbrance level
          </Option>
        {/each}
      </Select>
      <Text bind:value={$entity.notes}>Notes:</Text>
      <Text bind:value={$entity.categories}>Categories:</Text>
      <Select bind:value={$entity.signature}>
        <span slot="label">Signature: </span>
        {#each Object.values($entity.getCharacter().config.attributes) as signature, i}
          {#if signature.can_be_signature}
            <Option value={signature.signature}>{signature.signature}</Option>
          {/if}
        {/each}
      </Select>
      <Select bind:value={$entity.difficulty}>
        <span slot="label">Difficulty: </span>
        <Option value="E">E</Option>
        <Option value="A">A</Option>
        <Option value="H">H</Option>
        <Option value="VH">VH</Option>
        <Option value="W">W</Option>
      </Select>
      <Number bind:value={$entity.points} min={0}>Points:</Number>
      <Number value={$entity.calculateLevel()} disabled={true}>
        Final Level:
      </Number>
      <Text bind:value={$entity.reference}>Reference:</Text>
    </div>
  </TabPanel>
  <TabPanel />
  <TabPanel />
  <TabPanel component={Features} props={{ entity }} />
  <TabPanel />
  <TabPanel />
  <TabPanel />
</Tabs>
