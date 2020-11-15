<script>
  import List from "@ui/lists/List";
  import ListItem from "@ui/lists/ListItem";
  import MeleeWeaponEntity from "@ui/entities/MeleeWeapon";
  import MeleeWeaponEditor from "@ui/editors/MeleeWeaponEditor";

  import { WeaponType, MeleeWeapon } from "@internal";

  export let entity = null;
  $: ({ meleeWeapons$ } = entity);

  function addWeapon() {
    entity.embed(new MeleeWeapon());
  }

  $: props = {
    addItem: true,
    component: MeleeWeaponEntity,
    list: $meleeWeapons$,
  };
</script>

<style>
</style>

<List on:additem={addWeapon} {...props}>
  <tr slot="header">
    <th>Melee Weapons</th>
    <th class="w-full">Usage</th>
    <th>Lvl</th>
    <th>Parry</th>
    <th>Block</th>
    <th>Damage</th>
    <th>Reach</th>
    <th>Info</th>
    <th>ST</th>
  </tr>
</List>
