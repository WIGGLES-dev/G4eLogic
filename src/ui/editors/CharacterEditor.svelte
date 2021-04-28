<script context="module" lang="ts">
</script>

<script lang="ts">
  import { Tabs, Tab, TabPanel, TabList } from "@components/Tabs/tabs";
  import ProseMirror from "@ui/prosemirror/ProseMirror.svelte";
  import JsonEditor from "@components/JsonEditor.svelte";
  import Cropper from "@components/Cropper.svelte";
  import SkillList from "@ui/datatables/Skill.svelte";
  import TechniqueList from "@ui/datatables/Technique.svelte";
  import SpellList from "@ui/datatables/Spell.svelte";
  import EquipmentList from "@ui/datatables/Equipment.svelte";
  import WeaponList from "@ui/datatables/Weapon.svelte";
  import AttributeList from "@ui/AttributeList.svelte";
  import Pools from "@ui/Pools.svelte";
  import EncumbranceTable from "@ui/EncumbranceTable.svelte";
  import LiftingTable from "@ui/LiftingTable.svelte";
  import Statistics from "@ui/Statistics.svelte";
  import Silhouette from "@ui/Silhouette/Silhouette.svelte";
  import SizeRange from "@ui/SizeRange.svelte";
  import TraitList from "@ui/datatables/Trait.svelte";
  import { pluck, tap } from "rxjs/operators";
  import { load } from "js-yaml";
  import { System, Appearance } from "@internal";
  import { Character } from "@internal";
  import { character as characterMap } from "@app/gurps/utils";
  import { upload } from "@utils/dom";
  import { merge } from "@utils/object-mapper";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  import { onMount } from "svelte";

  const { state, processed$ } = getEditorContext<Character>();
  const dodge$ = processed$.pipe(pluck("attributes", "dodge", "level"));
  const encumbranceLevel$ = processed$.pipe(pluck("encumbranceLevel"));
  $: encumberedDodge = $dodge$ + $encumbranceLevel$;
  const config = state.sub("config");
  const notes = state.sub("notes");
  const profile = state.sub("profile");
  const name = state.sub("name");
  const image = state.sub("image");
  const initTab = state.sub("initTab");
  async function uploadGCSFile() {
    const files = await upload();
    const file = files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const obj = JSON.parse(text);
      const character: any = merge(obj, characterMap);
      state.assign({
        ...character,
        id: state.value.id,
      });
    } catch (err) {}
  }
  async function defaultConfiguration() {
    const response = await fetch("schemas/gurps/defaultCharacterConfig.yaml");
    const text = await response.text();
    try {
      const obj = load(text);
      config.value = obj;
    } catch (err) {}
  }
  async function uploadConfiguration() {
    const fl = await upload();
    const file = fl[0];
    const text = await file.text();
    try {
      const obj = JSON.parse(text);
      config.value = obj;
    } catch (err) {}
  }
</script>

<Tabs bind:initTab={$initTab}>
  <TabList>
    <Tab>General</Tab>
    <Tab>Combat</Tab>
    <Tab>Skills</Tab>
    <Tab>Equipment</Tab>
    <Tab>Traits</Tab>
    <Tab>Bio</Tab>
    <Tab>Notes</Tab>
    <Tab>Grimoire</Tab>
    <Tab>Settings</Tab>
  </TabList>
  <TabPanel>
    <div class="md:flex md:flex-wrap">
      <AttributeList />
      <Pools />
      <div class="">
        <EncumbranceTable />
        <LiftingTable />
      </div>
      <Silhouette minWidth="200px" viewBox="200 0 400 800" />
      <Statistics />
    </div>
  </TabPanel>
  <TabPanel>
    <div class="flex">
      <menu class="flex flex-col children:m-2">
        <button
          on:click={(e) => System.roll(`3d6ms${encumberedDodge}`)}
          class="button">Dodge ({encumberedDodge})</button
        >
        <button
          on:click={(e) => System.roll(`3d6ms${encumberedDodge + 3}`)}
          class="button">Dodge+ ({encumberedDodge + 3})</button
        >
      </menu>
      <div>
        <WeaponList
          character={state}
          type="ranged weapon"
          disableDrag={true}
          disableDrop={true}
          maxDepth={Number.POSITIVE_INFINITY}
        />
        <WeaponList
          character={state}
          type="melee weapon"
          disableDrag={true}
          disableDrop={true}
          maxDepth={Number.POSITIVE_INFINITY}
        />
      </div>
      <SizeRange />
    </div>
  </TabPanel>
  <TabPanel>
    <div class="flex flex-wrap">
      <TechniqueList character={state} />
      <SkillList character={state} />
    </div>
  </TabPanel>
  <TabPanel>
    <EquipmentList character={state} />
  </TabPanel>
  <TabPanel>
    <TraitList character={state}>Traits</TraitList>
  </TabPanel>
  <TabPanel class="mx-4">
    <section class="bio-grid children:m-2 md:grid md:auto-rows-min">
      <fieldset class="flex flex-col">
        <legend class="section-header">GENERAL</legend>
        <label>
          <span>Name</span>
          <input type="text" bind:value={$name} />
        </label>
        <label>
          <span>Nickname</span>
          <input type="text" bind:value={$profile.nickName} />
        </label>
        <fieldset class="flex flex-wrap children:flex-1">
          <label>
            <span>Sex</span>
            <input type="text" bind:value={$profile.sex} />
          </label>
          <label>
            <span>Gender</span>
            <input type="text" bind:value={$profile.gender} />
          </label>
        </fieldset>
        <fieldset class="flex flex-wrap children:flex-1">
          <label>
            <span>Race</span>
            <input type="text" bind:value={$profile.race} />
          </label>
          <label>
            <span>Size</span>
            <input
              type="number"
              placeholder="0"
              bind:value={$profile.sizeModifier}
            />
          </label>
        </fieldset>
        <fieldset class="flex flex-wrap">
          <label>
            <span>Handedness</span>
            <input type="text" bind:value={$profile.handedness} />
          </label>
          <label class="flex-1">
            <span>Reach</span>
            <input type="text" />
          </label>
        </fieldset>
        <label class="w-full text-center">
          <span>Reaction</span>
          <textarea rows="4" bind:value={$profile.reaction} />
        </label>
      </fieldset>
      <div class="row-span-2">
        <Cropper
          fallback="assets/silhouette.png"
          bind:src={$image}
          bind:cropped={$profile.cropped}
        />
      </div>
      <div class="flex flex-col">
        <div class="section-header">PHYSICAL</div>
        <div class="flex">
          <label for="">
            Age
            <input type="text" bind:value={$profile.age} />
          </label>
          <label for="">
            Appearance
            <select name="" id="" bind:value={$profile.appearance}>
              <option value={Appearance.Horrific}>Horrific</option>
              <option value={Appearance.Monstrous}>Monstrous</option>
              <option value={Appearance.Hideous}>Hideous</option>
              <option value={Appearance.Unattractive}> Unattractive </option>
              <option value={Appearance.Average} selected> Average </option>
              <option value={Appearance.Attractive}> Attractive </option>
              <option value={Appearance.Handsome_Beautiful}>
                Handsome/Beautiful
              </option>
              <option value={Appearance.Very_Handsome_Beautiful}>
                Very Handsome/Beauitiful
              </option>
              <option value={Appearance.Transcendent}> Transcendent </option>
            </select>
          </label>
        </div>
        <div class="flex">
          <label for="" class="flex-1">
            Weight
            <input type="text" bind:value={$profile.weight} />
          </label>
          <label for="" class="flex-1">
            Height
            <input type="text" bind:value={$profile.height} />
          </label>
        </div>
        <div class="flex">
          <label for="">
            Build
            <input type="text" bind:value={$profile.build} />
          </label>
          <label for="">
            Skin
            <input type="text" bind:value={$profile.skin} />
          </label>
        </div>

        <div class="flex">
          <label for="">
            Hair
            <input type="text" bind:value={$profile.hair} />
          </label>
          <label for="">
            Facial Hair
            <input type="text" bind:value={$profile.facialHair} />
          </label>
        </div>

        <div class="flex">
          <label for="">
            Eyes
            <input type="text" bind:value={$profile.eyes} />
          </label>
          <label for="">
            Voice
            <input type="text" bind:value={$profile.voice} />
          </label>
        </div>

        <label class="text-center" for="">
          Features
          <textarea
            name=""
            id=""
            rows="4"
            bind:value={$profile.appearanceFeatures}
          />
        </label>
      </div>
      <div class="flex flex-col">
        <div class="section-header">BACKGROUND</div>
        <div class="flex">
          <label for="">
            Birthday
            <input type="text" bind:value={$profile.birthday} />
          </label>
          <label for="">
            Birthplace
            <input type="text" bind:value={$profile.birthPlace} />
          </label>
        </div>
        <div class="flex">
          <label for="">
            Status
            <input type="text" bind:value={$profile.status} />
          </label>
          <label for="">
            Wealth
            <input type="text" bind:value={$profile.wealth} />
          </label>
        </div>
        <div class="flex">
          <label for="">
            Income
            <input type="text" bind:value={$profile.income} />
          </label>
          <label for="">
            Expenses
            <input type="text" bind:value={$profile.expenses} />
          </label>
        </div>
        <div class="flex">
          <label for="">
            Affiliation
            <input type="text" bind:value={$profile.affiliation} />
          </label>
          <label for="">
            Base
            <input type="text" bind:value={$profile.base} />
          </label>
        </div>
        <label class="text-center" for="">
          Family
          <textarea name="" id="" rows="4" bind:value={$profile.family} />
        </label>
      </div>
      <div class="flex flex-col">
        <div class="section-header">MISC</div>
        <label for="">
          Religion
          <input type="text" bind:value={$profile.religion} />
        </label>
        <label for="">
          Education
          <input type="text" bind:value={$profile.education} />
        </label>
        <label for="">
          Citizenship
          <input type="text" bind:value={$profile.citizenship} />
        </label>
        <label for="">
          Orientation
          <input type="text" bind:value={$profile.orientation} />
        </label>
        <label class="text-center" for="">
          Other
          <textarea rows="4" bind:value={$profile.other} />
        </label>
      </div>
    </section>
  </TabPanel>
  <TabPanel>
    <ProseMirror bind:content={$notes} />
  </TabPanel>
  <TabPanel>
    <SpellList character={state} />
  </TabPanel>
  <TabPanel class="flex flex-col">
    <JsonEditor class="flex-1" data={$config} let:editor>
      <menu>
        <button on:click={defaultConfiguration} type="button">
          Default Configuration
        </button>
        <button on:click={(e) => config.next(editor.get())} type="button">
          Save Configuration
        </button>
        <button on:click={uploadConfiguration}>Upload Configuration</button>
        <button on:click={uploadGCSFile}> Upload GCS File </button>
      </menu>
    </JsonEditor>
  </TabPanel>
</Tabs>

<style lang="postcss">
  .section-header {
    @apply bg-gray-700 text-center text-white w-full p-2;
  }

  label {
    @apply underline;
  }

  input,
  select {
    @apply w-full border-b border-black border-solid outline-none;
  }

  div.flex > label {
    @apply flex-1;
  }

  textarea {
    @apply outline-none border border-black border-solid rounded mt-2 w-full;
  }

  .bio-grid {
    grid-template-columns: 35% 1fr 35%;
  }
</style>