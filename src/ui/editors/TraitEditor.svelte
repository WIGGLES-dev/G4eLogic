<script context="module" lang="ts">
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import CategoryList from "@components/Form/CategoryList.svelte";
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import Features from "./panels/Features.svelte";
  import WeaponList from "@ui/datatables/Weapon.svelte";
  import ModifierList from "@ui/datatables/Modifier.svelte";
  import { ControlRating } from "@app/gurps/resources/trait";
</script>

<script lang="ts">
  import { Character, Trait } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { id$, processed$, state } = getEditorContext<Character>();
  $: type = $processed$.type;
  $: embeds = $processed$?.embedded?.trait;
  $: processed =
    type === "trait"
      ? (($processed$ as unknown) as Trait["embed"])
      : embeds && embeds[$id$];
  $: adjustedPoints = processed && processed.adjustedPoints;
  export let entity;
  const enabled$ = entity.sub("metadata", "enabled");
  const features$ = entity.sub("features");
</script>

<Tabs>
  <TabList>
    <Tab>Trait Data</Tab>
    <Tab disabled={true}>Prerequisites</Tab>
    <Tab>Features</Tab>
    <Tab>Modifiers</Tab>
    <Tab>Melee Weapons</Tab>
    <Tab>Ranged Weapons</Tab>
    <Tab>User Description</Tab>
  </TabList>
  <TabPanel>
    <form class="children:flex">
      <fieldset>
        <label class="flex-1">
          <span>Name</span>
          <input type="text" bind:value={$entity.name} />
        </label>
        <label>
          <span>Enabled</span>
          <input name="enabled" type="checkbox" bind:checked={$enabled$} />
        </label>
      </fieldset>
      <fieldset>
        <label>
          <span>Points</span>
          <input type="number" bind:value={$entity.basePoints} />
        </label>
      </fieldset>
      <label>
        <span>Notes</span>
        <input type="text" bind:value={$entity.notes} />
      </label>
      <fieldset>
        <label>
          <span>Has</span>
          <select bind:value={$entity.hasLevels}>
            <option value={false}>No Levels</option>
            <option value={true}>Levels</option>
            <option disabled={true}>Half Levels</option>
          </select>
        </label>
        <label>
          <span>Level</span>
          <input
            type="number"
            bind:value={$entity.levels}
            disabled={!$entity.hasLevels}
          />
        </label>
        <label>
          <span>1/2</span>
          <input type="checkbox" bind:checked={$entity.hasHalfLevel} disabled />
        </label>
        <label>
          <span>Leveled Points</span>
          <input
            type="number"
            bind:value={$entity.pointsPerLevel}
            disabled={!$entity.hasLevels}
          />
        </label>
        <label>
          <input type="checkbox" bind:checked={$entity.roundDown} />
          <span>Round Down</span>
        </label>
        <label>
          <span>Final Cost</span>
          <output>
            {adjustedPoints}
          </output>
        </label>
      </fieldset>
      <CategoryList bind:categories={$entity.categories} />
      <fieldset>
        <label>
          <span>CR</span>
          <select bind:value={$entity.controlRating}>
            <option value={ControlRating.CannotResist}
              >CR: N/A (Cannot Resist)</option
            >
            <option value={ControlRating.ResistRarely}
              >CR: 6 (Resist Rarely)</option
            >
            <option value={ControlRating.ResistFairlyOften}
              >CR: 9 (Resist Fairly Often)</option
            >
            <option value={ControlRating.ResistQuiteOften}
              >CR: 12 (Resist Quite Often)</option
            >
            <option value={ControlRating.ResistAlmostAlway}
              >CR: 15 (Resist Almost All The Time)</option
            >
            <option value={undefined}>None Required</option>
          </select>
        </label>
      </fieldset>
      <fieldset>
        <label>
          <span>Reference</span>
          <input type="text" bind:value={$entity.reference} />
        </label>
      </fieldset>
    </form>
  </TabPanel>
  <TabPanel />
  <TabPanel>
    <Features bind:features={$features$} />
  </TabPanel>
  <TabPanel>
    <ModifierList root={entity} type="trait modifier" />
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
