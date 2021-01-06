<script lang="ts">
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import CategoryList from "@components/Form/CategoryList.svelte";
  import { Equipment } from "@internal";

  export let id: string
  export let entity: Equipment = new Equipment({id, type: Equipment.type});
  const equipped$ = entity.selectEquipped();
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import Features from "./panels/Features.svelte";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import EquipmentModifiers from "./panels/EquipmentModifiers.svelte";
  function toggleEquipped(e: Event) {
    const target = e.target as HTMLInputElement;
    entity.update({
      disabled: !target.checked
    });
  }
</script>

<style>

</style>

{#if entity.exists}
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
      <form>
        <div class="field">
          <label for="">Name</label>
          <input
              class="flex-1"
              type="text"
              bind:value={$entity.name} />
        </div>

        <fieldset>
          <div class="field">
            <label for="">Equipped</label>
            <input
                type="checkbox"
                on:change={toggleEquipped}
                checked={$equipped$} />
          </div>
          <div class="field">
            <label for="">Ignore for Skills</label>
            <input type="checkbox" bind:checked={$entity.ignoreForskills} />
          </div>
        </fieldset>

        <fieldset>
          <div class="field">
            <label for="">Quantity</label>
            <input
                type="number"
                bind:value={$entity.quantity} />
          </div>
          <div class="field">
            <label for="">Weight</label>
            <input type="number" bind:value={$entity.weight} />
          </div>
          <div class="field">
            <label for="">Value</label>
            <input
                type="number"
                bind:value={$entity.value} />
          </div>
          <div class="field">
            <label class="flex-1" for="">Tech Level</label>
            <input type="text" bind:value={$entity.techLevel} />
          </div>
        </fieldset>

        <fieldset>
          <div class="field">
            <label for="">Uses</label>
            <input type="number" bind:value={$entity.uses} />
          </div>
          <div class="field">
            <label for="">Max Uses</label>
            <input type="number" bind:value={$entity.maxUses} />
          </div>
          <CategoryList bind:categories={$entity.categories} />
          <div class="field">
            <label for="">Reference</label>
            <input type="text" bind:value={$entity.reference} />
          </div>
        </fieldset>
        <div class="field">
          <label for="">Notes</label>
          <textarea bind:value={$entity.notes} rows="3" />
        </div>
      </form>
    </TabPanel>
    <TabPanel>
      <Features {entity} bind:features={$entity.features} />
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
