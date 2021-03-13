<script context="module" lang="ts">
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import CategoryList from "@components/Form/CategoryList.svelte";
  import { Equipment } from "@internal";
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import Features from "./panels/Features.svelte";
  import Weapon from "@ui/datatables/Weapon.svelte"
  import EquipmentModifiers from "./panels/EquipmentModifiers.svelte";
</script>

<script lang="ts">
  export let entity: Equipment;
  const equipped$ = entity.sub("metadata", "enabled");
  const modifiers$ = entity.sub("modifiers");
  const { eWeight$, eValue$ } = entity;
</script>

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
      <label>
        <span>Name</span>
        <input type="text" bind:value={$entity.name} placeholder="name" />
      </label>
      <fieldset>
        <label>
          <span>Quantity</span>
          <input type="number" bind:value={$entity.quantity} />
        </label>
        <label>
          <span>Tech Level</span>
          <input
            type="text"
            bind:value={$entity.techLevel}
            placeholder="tech level"
          />
        </label>
        <label>
          <span>Legality Class</span>
          <input
            type="text"
            bind:value={$entity.legaliticClass}
            placeholder="legality class"
          />
        </label>
        <label>
          <span>Equipped</span>
          <input type="checkbox" bind:checked={$equipped$} />
        </label>
      </fieldset>
      <fieldset>
        <label>
          <span>Value</span>
          <input type="number" bind:value={$entity.value} />
        </label>
        <label>
          <span>Extended Value</span>
          <output>
            ${+$eValue$.toFixed(3)}
          </output>
        </label>
      </fieldset>
      <fieldset>
        <label>
          <span>Weight</span>
          <input type="number" bind:value={$entity.weight} />
        </label>
        <label>
          <span>Extended Weight</span>
          <output>
            {+$eWeight$.toFixed(3)} lb
          </output>
        </label>
        <label>
          <span>Ignore for Skills</span>
          <input type="checkbox" bind:checked={$entity.ignoreForskills} />
        </label>
      </fieldset>
      <label>
        <span class="block">Notes</span>
        <textarea bind:value={$entity.notes} rows="3" class="w-full" />
      </label>
      <CategoryList bind:categories={$entity.categories} />
      <fieldset>
        <label>
          <span>Uses</span>
          <input type="number" bind:value={$entity.uses} placeholder="0" />
        </label>
        <label>
          <span>Max Uses</span>
          <input type="number" bind:value={$entity.maxUses} placeholder="0" />
        </label>
        <label>
          <span>Reference</span>
          <input
            type="text"
            bind:value={$entity.reference}
            placeholder="reference"
          />
        </label>
      </fieldset>
    </form>
  </TabPanel>
  <TabPanel>
    <Features bind:features={$entity.features} />
  </TabPanel>
  <TabPanel component={EquipmentModifiers} state$={modifiers$} />
  <TabPanel>
    <Weapon root={entity} type="melee weapon" />
  </TabPanel>
  <TabPanel>
    <Weapon root={entity} type="ranged weapon" />
  </TabPanel>
  <TabPanel>
    <ProseMirror bind:content={$entity.userDescription} />
  </TabPanel>
</Tabs>

<style lang="postcss">
  fieldset {
    @apply flex;
  }
</style>
