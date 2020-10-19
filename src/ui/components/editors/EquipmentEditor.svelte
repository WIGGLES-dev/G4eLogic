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

  import TinyMCE from "@ui/components/widgets/TinyMCE";

  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import EquipmentModifiers from "./panels/EquipmentModifiers.svelte";

  let entityName = $entity.constructor.name;
</script>

<style>
  label {
    @apply flex p-2;
  }

  div.flex label,
  input {
    @apply flex-1;
  }

  input,
  select {
    @apply border-b border-black border-solid outline-none ml-1;
  }

  input {
    @apply h-full pl-1;
  }

  textarea {
    @apply outline-none border border-black border-solid rounded mt-2 w-full;
  }
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
    <form class="p-3">
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
            on:change={(e) => (entity.categories = new Set(e.target.value.split(',')))}
            type="text"
            value={[...$entity.categories].join(',')} /></label>

        <label for="">Reference
          <input type="number" bind:value={$entity.reference} /></label>
      </div>

      <label for="">Notes </label>
      <textarea bind:value={$entity.notes} name="" id="" rows="3" />
    </form>
  </TabPanel>
  <TabPanel component={Features} props={{ entity }} />
  <TabPanel component={EquipmentModifiers} props={{ entity }} />
  <TabPanel component={MeleeWeapons} props={{ entity }} />
  <TabPanel component={RangedWeapons} props={{ entity }} />
  <TabPanel component={TinyMCE} props={{}} />
</Tabs>
