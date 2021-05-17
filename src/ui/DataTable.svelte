<script lang="ts">
  import "@app/lit/data-table";
  import { DataTable } from "@app/lit/data-table";
  import "@app/lit/custom-dialog";
  import { CustomDialog } from "@app/lit/custom-dialog";
  import { load } from "js-yaml";
  import { parseHitLocations } from "@app/gurps/resources/characterConfig";
  import { Action } from "@app/system";
  let table: DataTable;
  let dialog: CustomDialog;
  export let type;
  export let disableDrag = false;
  export let disableDrop = false;
  export let maxDepth = Number.POSITIVE_INFINITY;
  export let rootId: string;
  import { getEditorContext } from "@ui/Editor.svelte";
  import { Tree } from "@utils/tree";
  import { map, mergeMap, startWith } from "rxjs/operators";
  import { v4 } from "uuid";
  const { processed$, state, getEditor, System } = getEditorContext<any>();
  const signatureOptions$ = processed$.pipe(
    mergeMap(async (p) => {
      const { type, config } = p?.data ?? {};
      if (type === "character") {
        return config?.attributes;
      } else {
        const request = await fetch(
          "schemas/gurps/defaultCharacterConfig.yaml"
        );
        const text = await request.text();
        const config = load(text);
        return config?.attributes;
      }
    }),
    map((v) =>
      (Object.entries(v) as [string, any])
        .filter(([sig, { skillSignature }]) => skillSignature === true)
        .map(([sig, { abbreviation }]) => [sig, abbreviation])
    ),
    startWith([])
  );
  const locationOptions$ = processed$.pipe(
    mergeMap(async (p) => {
      const { type, config } = p?.data ?? {};
      if (type === "character") {
        return config?.locations;
      } else {
        const request = await fetch(
          "schemas/gurps/defaultCharacterConfig.yaml"
        );
        const text = await request.text();
        const config = load(text);
        return config?.locations ?? {};
      }
    }),
    map(parseHitLocations),
    map((v) => Object.entries(v)),
    map((locations) => locations.flatMap((name, location) => [name])),
    startWith([])
  );
  $: equipment = {
    enabled: ["checkbox"],
    quantity: ["number"],
    name: ["text", "toggle"],
    uses: ["number"],
    maxUses: ["number"],
    value: ["number"],
    weight: ["number"],
    containedValue: ["output", "toFixed(3)"],
    containedWeight: ["output", "toFixed(3)"],
    reference: ["text"],
  };
  $: skillDifficulties = [["E"], ["A"], ["H"], ["VH"], ["W"]];
  $: skill = {
    name: ["text", "toggle"],
    specialization: ["text"],
    signature: [$signatureOptions$],
    difficulty: [skillDifficulties],
    points: ["number"],
    mod: ["number"],
    relativeLevel: ["output", "floor"],
    level: ["output", "floor"],
    reference: ["text"],
  };
  $: technique = {
    name: ["text", "toggle"],
    difficulty: [["A"], ["H"]],
    points: ["number"],
    mod: ["number"],
    level: ["output", "floor"],
    reference: ["text"],
  };
  $: spell = {
    name: ["text", "toggle"],
    specialization: ["text"],
    signature: [$signatureOptions$],
    difficulty: [skillDifficulties],
    points: ["number"],
    mod: ["number"],
    relativeLevel: ["output", "floor"],
    level: ["output", "floor"],
    resist: ["text"],
    spellClass: ["text"],
    castingCost: ["text"],
    maintenanceCost: ["text"],
    castingTime: ["text"],
    duration: ["text"],
    reference: ["text"],
  };
  $: trait = {
    name: ["text", "toggle"],
    level: ["number"],
    adjustedPoints: ["output"],
    reference: ["text"],
  };
  $: weaponDamageTypes = [["cr"], ["cut"], ["imp"], ["fat"], ["tox"], ["cor"]];
  $: meleeWeapon = {
    name: ["text"],
    usage: ["text"],
    damage: ["text"],
    damageType: [weaponDamageTypes],
    level: ["output", "floor"],
    parryLevel: ["output", "floor"],
    blockLevel: ["output", "floor"],
    reach: ["text"],
    strengthRequirement: ["text"],
    reference: ["text"],
  };
  $: rangedWeapon = {
    name: ["text"],
    usage: ["text"],
    damage: ["text"],
    damageType: [weaponDamageTypes],
    level: ["output", "floor"],
    accuracy: ["text"],
    range: ["text"],
    rateOfFire: ["text"],
    shots: ["text"],
    bulk: ["text"],
    recoil: ["text"],
    strengthRequirement: ["text"],
    reference: ["text"],
  };
  $: traitModifier = {
    enabled: ["checkbox"],
    name: ["text"],
    costModifier: ["output"],
    reference: ["text"],
  };
  $: equipmentModifier = {
    enabled: ["checkbox"],
    name: ["text"],
    techLevel: ["text"],
    costAdjustment: ["output"],
    weightAdjustment: ["output"],
    reference: ["text"],
  };
  $: setups = {
    skill,
    spell,
    equipment,
    technique,
    trait,
    "melee weapon": meleeWeapon,
    "ranged weapon": rangedWeapon,
    "trait modifier": traitModifier,
    "equipment modifier": equipmentModifier,
  };
  $: filter = {
    type,
  };
  function getContextmenuOptions(e) {
    return [];
  }
  function handleCellchange(e) {
    const {
      detail: { path, value },
    } = e;
    state.sub(...path).set(value);
  }
  function handleClick(e) {
    const {
      detail: { id, prop, value },
    } = e;
  }
  function handleDelete(e) {
    const {
      detail: { path, value },
    } = e;
    state.sub(...path).delete();
  }
  function handleAdd(e) {
    const {
      detail: { path, value },
    } = e;
    state.sub(...path, "children").push(
      System.validate({
        type,
        id: v4(),
      }).data
    );
  }
  function handleMove(e) {
    const {
      detail: { from, to, foreign, insert },
    } = e;
    const opts = {
      nest: insert ? ["children"] : undefined,
    };
    if (foreign) {
    } else {
      state.value = Tree.move(
        state.value,
        (v) => v?.id === from.id,
        (v) => v?.id === to.id,
        opts
      );
    }
  }
  function handleEdit(e) {
    const {
      detail: { id, path },
    } = e;
    editingState = state.sub(...path);
    dialog.showModal();
  }
  let editingState;

</script>

<custom-dialog bind:this={dialog}>
  {#await getEditor(type) then editor}
    {#if editingState && $editingState}
      <svelte:component this={editor} entity={editingState} />
    {/if}
  {/await}
  <button on:click={() => dialog.close()} class="w-full">Close</button>
</custom-dialog>
<data-table
  bind:this={table}
  {rootId}
  template={setups[type]}
  data={$state}
  processed={$processed$.embedded[type]}
  {maxDepth}
  {filter}
  on:cellchange={handleCellchange}
  on:click={handleClick}
  on:add={handleAdd}
  on:delete={handleDelete}
  on:move={handleMove}
  on:edit={handleEdit}
>
  <tr>
    {#if type === "skill"}
      <th>Skill</th>
      <th>Specialization</th>
      <th>Signature</th>
      <th>Difficulty</th>
      <th>Points</th>
      <th>Mod</th>
      <th>RSL</th>
      <th>Level</th>
      <th>Reference</th>
    {:else if type === "technique"}
      <th>Technique</th>
      <th>Difficulty</th>
      <th>Points</th>
      <th>Mod</th>
      <!-- <th>RSL</th> -->
      <th>Level</th>
      <th>Reference</th>
    {:else if type === "spell"}
      <th>Spell</th>
      <th>Signature</th>
      <th>Difficulty</th>
      <th>Points</th>
      <th>Mod</th>
      <th>RSL</th>
      <th>Level</th>
      <th>Resist</th>
      <th>Spell Class</th>
      <th>Casting Cost </th>
      <th>Maintenance Cost</th>
      <th>Casting Time</th>
      <th> Duration </th>
      <th>Reference</th>
    {:else if type === "trait"}
      <th>Trait</th>
      <th>Level</th>
      <th>Pts</th>
      <th>Reference</th>
    {:else if type === "equipment"}
      <th>E</th>
      <th class="px-2">#</th>
      <th>Equipment</th>
      <th>Uses</th>
      <th>Max Uses</th>
      <th>Value</th>
      <th>Weight</th>
      <th>EValue</th>
      <th>EWeight</th>
      <th>Reference</th>
    {:else if type.includes("weapon")}
      <th>Weapons</th>
      <th>Usage</th>
      <th>Damage</th>
      <th>Type</th>
      <th>Lvl</th>
      {#if type === "melee weapon"}
        <th>Parry</th>
        <th>Block</th>
        <th>Reach</th>
      {:else if type === "ranged weapon"}
        <th>Acc</th>
        <th>Range</th>
        <th>Rof</th>
        <th>Shots</th>
        <th>Bulk</th>
        <th>Rcl</th>
      {/if}
      <th>ST</th>
      <th>Ref</th>
      <slot name="edit" />
    {:else if type.includes("modifier")}
      <th>Enabled</th>
      <th>Modifier</th>
      {#if type === "equipment modifier"}
        <th>Cost Adjustment</th>
        <th>Weight Adjustment</th>
      {:else if type === "trait modifier"}
        <th>Cost Modifier</th>
      {/if}
      <th>Ref</th>
    {:else}
      <!--  -->
    {/if}
  </tr>
</data-table>

<style>
</style>
