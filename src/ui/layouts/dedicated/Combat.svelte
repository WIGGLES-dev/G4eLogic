<script>
  import { getContext } from "svelte";
  import List from "@ui/lists/List";

  import MeleeWeapon from "@ui/entities/MeleeWeapon";
  import MeleeWeaponEditor from "@ui/editors/MeleeWeaponEditor";

  import RangedWeapon from "@ui/entities/RangedWeapon";
  import RangedWeaponEditor from "@ui/editors/RangedWeaponEditor";

  import Silhouette from "@ui/widgets/Silhouette";
  import SizeRange from "@ui/widgets/SizeRange";

  const { character } = getContext("editor");

  $: dodge = $character.dodgeScore();
  $: encumberedDodge = $character.encumberedDodgeScore();
</script>

<style>
  .button {
    @apply w-1/2 bg-gray-700 text-white mx-4;
  }
</style>

<div class="flex">
  <div>
    <div class="flex mx-4">
      <button class="button">Dodge ({encumberedDodge})</button>
      <button class="button">Dodge+ ({encumberedDodge + 3})</button>
    </div>
    <div class="my-4">
      <List
        title="Melee Weapons"
        component={MeleeWeapon}
        editor={MeleeWeaponEditor}
        list={$character.meleeWeapons()}
        config={{ addItem: false }}>
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
    <List
      title="Ranged Weapons"
      component={RangedWeapon}
      editor={RangedWeaponEditor}
      list={$character.rangedWeapons()}
      config={{ addItem: false }}>
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
  </div>
  <div class="w-1/3 mx-4">
    <Silhouette />
  </div>
  <div class="flex-1">
    <SizeRange />
  </div>
</div>
