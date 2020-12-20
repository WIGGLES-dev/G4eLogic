<script lang="ts">
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";
  import Form from "@ui/form/Form.svelte";
  import CategoryList from "@ui/form/CategoryList.svelte";

  import { Equipment } from "@internal";

  export let entity: Equipment;
  $: ({ equipped$, exists } = entity);

  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import Features from "./panels/Features.svelte";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import EquipmentModifiers from "./panels/EquipmentModifiers.svelte";
</script>

<style>
</style>

{#if exists && $entity}
  <Tabs>
    <TabList>
      <Tab>Data</Tab>
      <Tab>Features</Tab>
      <Tab disabled={true}>Modifiers</Tab>
      <Tab>Melee Weapons</Tab>
      <Tab>Ranged Weapons</Tab>
      <Tab>User Description</Tab>
    </TabList>
    <TabPanel>
      <Form>
        <label for="">Name<input
            class="flex-1"
            type="text"
            bind:value={$entity.name} /></label>

        <div class="flex">
          <label for="">Equipped
            <input
              type="checkbox"
              on:change={(e) => entity.set({ disabled: !e.target.checked })}
              checked={$equipped$} />
          </label>
          <label for="">Ignore for Skills
            <input type="checkbox" bind:checked={$entity.ignoreForskills} />
          </label>
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
            <input type="number" bind:value={$entity.uses} />
          </label>

          <label for="">Max Uses
            <input type="number" bind:value={$entity.maxUses} />
          </label>

          <CategoryList bind:categories={$entity.categories} />

          <label for="">Reference
            <input type="text" bind:value={$entity.reference} />
          </label>
        </div>

        <label for="">Notes </label>
        <textarea bind:value={$entity.notes} rows="3" />
      </Form>
    </TabPanel>
    <TabPanel>
      <Features {entity} bind:features={$entity.bonuses} />
    </TabPanel>
    <TabPanel component={EquipmentModifiers} {entity} />
    <TabPanel>
      <MeleeWeapons {entity} />
    </TabPanel>
    <TabPanel>
      <RangedWeapons {entity} />
    </TabPanel>
    <TabPanel>
      <ProseMirror bind:content={$entity.userDescription} />
    </TabPanel>
  </Tabs>
{/if}
