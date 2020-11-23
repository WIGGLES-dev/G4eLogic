<script>
  import { Tabs, Tab, TabPanel, TabList } from "@ui/tabs/tabs";
  import Form from "@ui/form/Form";
  import CategoryList from "@ui/form/CategoryList";

  import ProseMirror from "@ui/prosemirror/ProseMirror";
  import AttributeOptions from "@ui/options/AttributeOptions";

  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import SkillDefaults from "./panels/SkillDefaults";

  export let entity = {};
  $: ({ level$, exists } = entity);
</script>

<style>
</style>

{#if exists}
  <Tabs>
    <TabList>
      <Tab>Data</Tab>
      <Tab>Defaults</Tab>
      <Tab disabled={true}>Prerequisites</Tab>
      <Tab>Features</Tab>
      <Tab>Melee Weapons</Tab>
      <Tab>Ranged Weapons</Tab>
      <Tab>User Description</Tab>
    </TabList>
    <TabPanel>
      <Form>
        <div class="flex">
          <label for="">Name
            <input
              class="flex-1"
              type="text"
              placeholder="name"
              bind:value={$entity.name} /></label>
          <label for="">Specialization<input
              type="text"
              bind:value={$entity.specialization} /></label>
        </div>
        <div class="flex">
          <label for="">
            Signature
            <AttributeOptions
              {entity}
              signaturesOnly={true}
              bind:attribute={$entity.signature} />
          </label>
          <label for="">
            Difficulty
            <select bind:value={$entity.difficulty}>
              <option value={undefined} />
              <option value="E">E</option>
              <option value="A">A</option>
              <option value="H">H</option>
              <option value="VH">VH</option>
              <option value="W">W</option>
            </select>
          </label>
          <label for="">Points
            <input
              type="number"
              placeholder="points"
              bind:value={$entity.points} />
          </label>
          <label for="">Final Level
            <input type="number" disabled value={Math.floor($level$)} /></label>
        </div>

        <div class="flex">
          <label for="">
            Encumbrance
            <select bind:value={$entity.encumbrancePenaltyMultiple}>
              <option value={undefined} />
              <option value={0}>No penalty due to encumbrance</option>
              <option value={1}>Penalty equal to the encumbrance level</option>
              {#each new Array(7) as encumbranceMultiple, i (i)}
                <option value={i}>
                  Penalty equal to
                  {i}
                  times the current encumbrance level
                </option>
              {/each}
            </select>
          </label>

          <label for="">TL
            <input
              type="text"
              placeholder="tech level"
              bind:value={$entity.techLevel} />
          </label>

          <label for="">Disabled
            <input type="checkbox" bind:checked={$entity.disabled} />
          </label>
        </div>

        <div class="flex">
          <CategoryList bind:categories={$entity.categories} />
          <label for="">Reference
            <input
              type="text"
              placeholder="reference"
              bind:value={$entity.reference} /></label>
        </div>
        <label for="">Notes </label>
        <textarea bind:value={$entity.notes} placeholder="notes" rows="3" />
      </Form>
    </TabPanel>
    <TabPanel>
      <SkillDefaults {entity} bind:defaults={$entity.defaults} />
    </TabPanel>
    <TabPanel />
    <TabPanel>
      <Features {entity} bind:features={$entity.bonuses} />
    </TabPanel>
    <TabPanel component={MeleeWeapons} {entity} />
    <TabPanel component={RangedWeapons} {entity} />
    <TabPanel>
      <ProseMirror bind:content={$entity.userDescription} />
    </TabPanel>
  </Tabs>
{/if}
