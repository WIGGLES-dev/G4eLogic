<script>
  import { getContext } from "svelte";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import Spell from "@ui/components/entities/Spell";
  import SpellEditor from "@ui/components/editors/SpellEditor";

  const { character } = getContext("app");

  $: spellList = $character.spellList;

  function addSpell() {
    spellList.addListItem();
  }
</script>

<style>
</style>

<List
  on:additem={addSpell}
  title="Spells"
  component={Spell}
  editor={SpellEditor}
  list={spellList.contents.arr}
  display="table">
  <tr slot="header">
    <th class="w-full" scope="col">Spells</th>
    <th scope="col">Resist</th>
    <th scope="col">Class</th>
    <th scope="col">Cost</th>
    <th scope="col">Maintain</th>
    <th scope="col">Time</th>
    <th scope="col">Duration</th>
    <th scope="col">SL</th>
    <th scope="col">RSL</th>
    <th scope="col">Pts</th>
    <th scope="col">Ref</th>
  </tr>
</List>

<!-- <Tabs>
  <TabList>
    <Tab>Spells</Tab>
    <Tab>Rituals</Tab>
  </TabList>
  <TabPanel>
    <div>

    </div>
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
</Tabs> -->
