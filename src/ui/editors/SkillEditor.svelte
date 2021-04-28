<script context="module" lang="ts">
</script>

<script lang="ts">
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import CategoryList from "@components/Form/CategoryList.svelte";
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import AttributeOptions from "@ui/options/AttributeOptions.svelte";
  import DifficultyOptions from "@ui/options/DifficultyOptions.svelte";
  import Features from "./panels/Features.svelte";
  import WeaponList from "@ui/datatables/Weapon.svelte";
  import SkillDefaults from "./panels/SkillDefaults.svelte";
  import { Character, Skill } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { id$, processed$, state } = getEditorContext<Character>();
  $: type = $processed$.type;
  $: embeds = $processed$?.embedded?.skill;
  $: processed =
    type === "skill"
      ? (($processed$ as unknown) as Skill["embed"])
      : embeds && embeds[$id$];
  $: level = processed && Math.floor(processed.level);
  export let entity;
  const signature$ = entity.sub("signature");
  const defaults$ = entity.sub("defaults");
  const features$ = entity.sub("features");
</script>

<Tabs bind:initTab={$entity.initTab}>
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
        <label>
          <span>Name</span>
          <input
            class="flex-1"
            type="text"
            placeholder="name"
            bind:value={$entity.name}
          />
        </label>
        <label>
          <span>Specialization</span>
          <input type="text" bind:value={$entity.specialization} />
        </label>
      </fieldset>
      <fieldset>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <span>Signature</span>
          <AttributeOptions
            bind:attribute={$signature$}
            signaturesOnly={true}
          />
        </label>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <span>Difficulty</span>
          <DifficultyOptions bind:difficulty={$entity.difficulty} />
        </label>
        <label>
          <span>Points</span>
          <input
            type="number"
            placeholder="points"
            bind:value={$entity.points}
          />
        </label>
        <label>
          <span>Final Level</span>
          <output>
            {level}
          </output>
        </label>
      </fieldset>
      <fieldset>
        <label>
          <span>Encumbrance</span>
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
        <label>
          <span>TL</span>
          <input
            type="text"
            placeholder="tech level"
            bind:value={$entity.techLevel}
          />
        </label>
        <label>
          <span>Disabled</span>
          <input type="checkbox" bind:checked={$entity.disabled} />
        </label>
      </fieldset>
      <fieldset>
        <CategoryList class="flex-1" bind:categories={$entity.categories} />
        <label>
          <span>Reference</span>
          <input
            type="text"
            placeholder="reference"
            bind:value={$entity.reference}
          />
        </label>
      </fieldset>
      <label>
        <span>Notes</span>
        <textarea bind:value={$entity.notes} placeholder="notes" />
      </label>
    </form>
  </TabPanel>
  <TabPanel>
    <SkillDefaults bind:defaults={$defaults$} />
  </TabPanel>
  <TabPanel />
  <TabPanel>
    <Features bind:features={$features$} />
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
