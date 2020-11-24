<script>
  import { getContext } from "svelte";
  import List from "@ui/lists/List";

  import MeleeWeaponEntity from "@ui/entities/MeleeWeapon";
  import RangedWeaponEntity from "@ui/entities/RangedWeapon";

  import Silhouette from "@ui/widgets/Silhouette";
  import SizeRange from "@ui/widgets/SizeRange";

  const { character } = getContext("editor");
  const {
    encumbranceLevel$,
    attributes$,
    meleeWeapons$,
    rangedWeapons$,
  } = character;

  $: dodge = $attributes$["dodge"]
    ? $attributes$["dodge"].calculateLevel() || 5
    : 5;
  $: encumberedDodge = dodge + ($encumbranceLevel$ || 0);

  $: rangedWeaponProps = {
    addItem: false,
    component: RangedWeaponEntity,
    list: $rangedWeapons$,
  };
  $: meleeWeaponProps = {
    addItem: false,
    component: MeleeWeaponEntity,
    list: $meleeWeapons$,
  };
</script>

<style>
  .button {
    @apply w-1/2 bg-gray-700 text-white mx-4;
  }
</style>

<div class="flex">
  <div>
    <div class="flex mx-4">
      <button
        on:click={() => character.executeAction('dodge')}
        class="button">Dodge ({encumberedDodge})</button>
      <button
        class="button"
        on:click={() => character.executeAction('dodge+')}>Dodge+ ({encumberedDodge + 3})</button>
    </div>
    <div class="my-4">
      <List {...meleeWeaponProps}>
        <colgroup slot="colgroup">
          <col />
          <col />
          <col />
          <col span="5" />
        </colgroup>
        <tr slot="header">
          <th scope="col" class="w-full">Melee Weapons</th>
          <th scope="col">Usage</th>
          <th scope="col">Lvl</th>
          <th scope="col">Parry</th>
          <th scope="col">Block</th>
          <th scope="col">Info</th>
          <th scope="col">Damage</th>
          <th scope="col">Reach</th>
          <th scope="col">ST</th>
        </tr>
      </List>
    </div>
    <List {...rangedWeaponProps}>
      <colgroup slot="colgroup">
        <col />
        <col />
        <col />
        <col span="8" />
      </colgroup>
      <tr slot="header">
        <th scope="col">Ranged Weapons</th>
        <th scope="col">Usage</th>
        <th scope="col">Lvl</th>
        <th scope="col">Damage</th>
        <th scope="col">Acc</th>
        <th scope="col">Range</th>
        <th scope="col">RoF</th>
        <th scope="col">Shots</th>
        <th scope="col">Bulk</th>
        <th scope="col">Rcl</th>
        <th scope="col">ST</th>
      </tr>
    </List>
    <SizeRange />
  </div>
  <div class="flex-1">
    <Silhouette maxHeight="600px" minWidth="225px" viewBox="200 0 400 800" />
  </div>
</div>
