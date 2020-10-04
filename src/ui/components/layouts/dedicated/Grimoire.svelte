<script>
  import { getContext } from "svelte";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import Spell from "@ui/components/entities/Spell";

  const { character } = getContext("app");

  $: spellList = $character.spellList;
</script>

<Tabs>
  <TabList>
    <Tab>Spells</Tab>
    <Tab>Rituals</Tab>
  </TabList>
  <TabPanel>
    <List
      title="Spells"
      component={Spell}
      editor={null}
      list={spellList.contents.arr}
      display="table">
      <tr slot="header">
        <th class="w-full">Spells</th>
        <th>Resist</th>
        <th>Class</th>
        <th>Cost</th>
        <th>Maintain</th>
        <th>Time</th>
        <th>Duration</th>
        <th>SL</th>
        <th>RSL</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
</Tabs>
