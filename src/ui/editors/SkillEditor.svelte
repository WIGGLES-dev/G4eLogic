<script lang='ts'>
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import CategoryList from "@components/Form/CategoryList.svelte";
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import AttributeOptions from "@ui/options/AttributeOptions.svelte";
  import DifficultyOptions from "@ui/options/DifficultyOptions.svelte";

  import Features from "./panels/Features.svelte";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import SkillDefaults from "./panels/SkillDefaults.svelte";
  import { Skill } from '@internal';

  export let id: string
  export let entity: Skill = new Skill({id, type: Skill.type})
  $: ({ 
    level$,
    exists 
    } = entity);
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
      <form>
        <fieldset>
          <div class="field">
            <label for="">Name</label>
            <input
              class="flex-1"
              type="text"
              placeholder="name"
              bind:value={$entity.name} />
          </div>
          <div class="field">
              <label for="">Specialization</label>
              <input
                type="text"
                bind:value={$entity.specialization} />
          </div>
        </fieldset>
       
        <fieldset>
          <div class="field">
            <label for="">Signature</label>
            <AttributeOptions
              {entity}
              signaturesOnly={true}
              bind:attribute={$entity.signature} />
          </div>
          <div class="field">
            <label for="">Difficulty</label>
            <DifficultyOptions bind:difficulty={$entity.difficulty} />
          </div>
          <div class="field">
            <label for="">Points</label>
            <input
              type="number"
              placeholder="points"
              bind:value={$entity.points} />
          </div>
          <div class="field">
            <label for="">Final Level</label>
            <output>{Math.floor($level$)}</output>
          </div>
        </fieldset>

        <fieldset>
          <div class="field">
            <label for="">Encumbrance</label>
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
          </div>

          <div class="field">
            <label for="">TL</label>
            <input
              type="text"
              placeholder="tech level"
              bind:value={$entity.techLevel} />
          </div>

          <div class="field">
            <label for="">Disabled</label>
            <input type="checkbox" bind:checked={$entity.disabled} />
          </div>
        </fieldset>

        <fieldset>
          <CategoryList bind:categories={$entity.categories} />
          <div class="field">
            <label for="">Reference</label>
            <input
              type="text"
              placeholder="reference"
              bind:value={$entity.reference} />
          </div>
          <div class="field">
            <label for="">Notes</label>
            <textarea bind:value={$entity.notes} placeholder="notes" rows="3" />
          </div>
        </fieldset>
      </form>
    </TabPanel>
    <TabPanel>
      <SkillDefaults {entity} bind:defaults={$entity.defaults} />
    </TabPanel>
    <TabPanel />
    <TabPanel>
      <Features {entity} bind:features={$entity.features} />
    </TabPanel>
    <TabPanel component={MeleeWeapons} {entity} />
    <TabPanel component={RangedWeapons} {entity} />
    <TabPanel>
      <ProseMirror bind:content={$entity.userDescription} />
    </TabPanel>
  </Tabs>
{/if}
