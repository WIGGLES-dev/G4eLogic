<script>
  import { getContext } from "svelte";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import MeleeWeapon from "@ui/components/entities/MeleeWeapon";
  import RangedWeapon from "@ui/components/entities/RangedWeapon";

  const { character } = getContext("app");
</script>

<Tabs>
  <TabList>
    <Tab>Weapons</Tab>
    <Tab>Tools</Tab>
    <Tab>Armor</Tab>
  </TabList>
  <TabPanel>
    <List
      title="Ranged Weapons"
      component={RangedWeapon}
      list={$character.rangedWeapons()}
      display="table">
      <colgroup slot="colgroup">
        <col class="w-full" />
        <col />
        <col />
        <col span="8" />
      </colgroup>
      <tr slot="header">
        <th scope="col">Ranged Weapons</th>
        <th scope="col">Usage</th>
        <th scope="col">Lvl</th>
        <th scope="col">Acc</th>
        <th scope="col">Damage</th>
        <th scope="col">Range</th>
        <th scope="col">RoF</th>
        <th scope="col">Shots</th>
        <th scope="col">Bulk</th>
        <th scope="col">Rcl</th>
        <th scope="col">ST</th>
      </tr>
    </List>
    <List
      title="Melee Weapons"
      component={MeleeWeapon}
      list={$character.meleeWeapons()}
      display="table">
      <colgroup slot="colgroup">
        <col class="w-full" />
        <col />
        <col />
        <col span="5" />
      </colgroup>
      <tr slot="header">
        <th scope="col">Melee Weapons</th>
        <th scope="col">Usage</th>
        <th scope="col">Lvl</th>
        <th scope="col">Parry</th>
        <th scope="Col">Block</th>
        <th scope="col">Damage</th>
        <th scope="col">Reach</th>
        <th scope="col">ST</th>
      </tr>
    </List>
  </TabPanel>
  <TabPanel />
  <TabPanel />
</Tabs>
