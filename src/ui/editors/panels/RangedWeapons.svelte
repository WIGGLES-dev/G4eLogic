<script>
  import List from "@ui/lists/List";
  import RangedWeaponEntity from "@ui/entities/RangedWeapon";

  import { RangedWeapon } from "@internal";
  export let entity = {};
  $: ({ rangedWeapons$ } = entity);

  function addWeapon() {
    entity.splice(new RangedWeapon(null, null));
  }

  $: props = {
    addItem: true,
    component: RangedWeaponEntity,
    list: $rangedWeapons$,
  };
</script>

<style>
</style>

<List on:additem={addWeapon} {...props}>
  <tr slot="header">
    <th>Ranged Weapons</th>
    <th class="w-full">Usage</th>
    <th>Lvl</th>
    <th>Damage</th>
    <th>Acc</th>
    <th>Range</th>
    <th>RoF</th>
    <th>Shots</th>
    <th>Bulk</th>
    <th>Rcl</th>
    <th>ST</th>
  </tr>
</List>
