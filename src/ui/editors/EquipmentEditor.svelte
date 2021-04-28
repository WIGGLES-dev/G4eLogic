<script context="module" lang="ts">
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import CategoryList from "@components/Form/CategoryList.svelte";
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import Features from "./panels/Features.svelte";
  import WeaponList from "@ui/datatables/Weapon.svelte";
</script>

<script lang="ts">
  import { Character, Equipment } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { id$, processed$, state } = getEditorContext<Character>();
  $: type = $processed$.type;
  $: embeds = $processed$?.embedded?.equipment;
  $: processed =
    type === "equipment"
      ? (($processed$ as unknown) as Equipment["embed"])
      : embeds && embeds[$id$];
  $: containedWeight = processed && +processed?.containedWeight?.toFixed(3);
  $: containedValue = processed && +processed?.containedValue?.toFixed(3);
  export let entity;
  const equipped$ = entity.sub("enabled");
  const modifiers$ = entity.sub("modifiers");
</script>

<Tabs bind:initTab={$entity.initTab}>
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
            {containedValue}
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
            {containedWeight}
          </output>
        </label>
        <label>
          <span>Ignore for Skills</span>
          <input type="checkbox" bind:checked={$entity.ignoreForskills} />
        </label>
      </fieldset>
      <label>
        <span>Notes</span>
        <textarea bind:value={$entity.notes} />
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
  <TabPanel>
    <!-- MODIFIERS -->
  </TabPanel>
  <TabPanel>
    <WeaponList character={entity} type="melee weapon" />
  </TabPanel>
  <TabPanel>
    <WeaponList character={entity} type="ranged weapon" />
  </TabPanel>
  <TabPanel>
    <ProseMirror bind:content={$entity.userDescription} />
  </TabPanel>
</Tabs>

<style lang="postcss">
</style>
