<script>
  import { Number, Text, Select, Option, OptGroup, Checkbox } from "@ui/index";
  import { Tabs, Tab, TabPanel, TabList } from "@ui/index";

  import TinyMCE from "@ui/components/widgets/TinyMCE";

  import Features from "./panels/Features";
  import MeleeWeapons from "./panels/MeleeWeapons.svelte";
  import RangedWeapons from "./panels/RangedWeapons.svelte";
  import SkillDefaults from "./panels/SkillDefaults";

  export let entity = null;
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
    <Tab>Defaults</Tab>
    <Tab disabled={true}>Prerequisites</Tab>
    <Tab>Features</Tab>
    <Tab>Melee Weapons</Tab>
    <Tab>Ranged Weapons</Tab>
    <Tab disabled={true}>User Description</Tab>
  </TabList>
  <TabPanel>
    <form action="" class="p-3">
      <div class="flex">
        <label for="">Name<input
            class="flex-1"
            type="text"
            bind:value={$entity.name} /></label>
        <label for="">Specialization<input
            type="text"
            bind:value={$entity.specialization} /></label>
      </div>
      <div class="flex">
        <label for="">
          Signature
          <select name="" id="" bind:value={$entity.signature}>
            {#each Object.values($entity
                .getCharacter()
                .config.getConfig().attributes) as signature, i}
              {#if signature.can_be_signature}
                <option value={signature.signature}>
                  {signature.signature}
                </option>
              {/if}
            {/each}
          </select>
        </label>
        <label for="">
          Difficulty
          <select bind:value={$entity.difficulty}>
            <option value="E">E</option>
            <option value="A">A</option>
            <option value="H">H</option>
            <option value="VH">VH</option>
            <option value="W">W</option>
          </select>
        </label>
        <label for="">Points
          <input type="number" bind:value={$entity.points} />
        </label>
        <label for="">Final Level
          <input
            type="number"
            disabled
            value={$entity.calculateLevel()} /></label>
      </div>

      <div class="flex">
        <label for="">
          Encumbrance
          <select name="" id="" bind:value={$entity.encumbrancePenaltyMultiple}>
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

        <label for="">TL<input
            type="text"
            bind:value={$entity.techLevel} /></label>

        <label for="">Disabled<input
            type="checkbox"
            bind:checked={$entity.disabled} /></label>
      </div>

      <div class="flex">
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
  <TabPanel component={SkillDefaults} props={{ entity }} />
  <TabPanel />
  <TabPanel component={Features} props={{ entity }} />
  <TabPanel component={MeleeWeapons} props={{ entity }} />
  <TabPanel component={RangedWeapons} props={{ entity }} />
  <TabPanel component={TinyMCE} props={{}} />
</Tabs>
