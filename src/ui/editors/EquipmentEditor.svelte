<script>
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";
  import Form from "@ui/form/Form";

  export let entity = null;

  import TinyMCE from "@ui/widgets/TinyMCE";
  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import EquipmentModifiers from "./panels/EquipmentModifiers.svelte";
</script>

<style>
</style>

<Tabs>
  <TabList>
    <Tab>Data</Tab>
    <Tab>Features</Tab>
    <Tab disabled={true}>Modifiers</Tab>
    <Tab>Melee Weapons</Tab>
    <Tab>Ranged Weapons</Tab>
    <Tab disabled={true}>User Description</Tab>
  </TabList>
  <TabPanel>
    <Form>
      <label for="">Name<input
          class="flex-1"
          type="text"
          bind:value={$entity.name} /></label>

      <div class="flex">
        <label for="">Equipped<input
            type="checkbox"
            bind:checked={$entity.equipped} /></label>
        <label for="">Ignore for Skills<input
            type="checkbox"
            bind:value={$entity.applySkillEncumbrancePenalty} /></label>
      </div>

      <div class="flex">
        <label for="">Quantity<input
            type="number"
            bind:value={$entity.quantity} /></label>

        <label for="">Weight
          <input type="number" bind:value={$entity.weight} /></label>

        <label for="">Value<input
            type="number"
            bind:value={$entity.value} /></label>

        <label class="flex-1" for="">Tech Level
          <input type="text" bind:value={$entity.techLevel} /></label>
      </div>

      <div class="flex">
        <label for="">Uses
          <input type="number" bind:value={$entity.uses} /></label>

        <label for="">Max Uses
          <input type="number" bind:value={$entity.maxUses} /></label>

        <label for="">Categories
          <input
            on:change={(e) => ($entity.categories = new Set(e.target.value.split(',')))}
            type="text"
            value={[...$entity.categories].join(',')} /></label>

        <label for="">Reference
          <input type="text" bind:value={$entity.reference} /></label>
      </div>

      <label for="">Notes </label>
      <textarea bind:value={$entity.notes} name="" id="" rows="3" />
    </Form>
  </TabPanel>
  <TabPanel component={Features} props={{ entity: $entity }} />
  <TabPanel component={EquipmentModifiers} props={{ entity: $entity }} />
  <TabPanel component={MeleeWeapons} props={{ entity: $entity }} />
  <TabPanel component={RangedWeapons} props={{ entity: $entity }} />
  <TabPanel component={TinyMCE} props={{}} />
</Tabs>
