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
  /* div :global(td:nth-child(2), th:nth-child(2)),
  div :global(td:nth-child(3), th:nth-child(3)),
  div :global(td:nth-child(4), th:nth-child(4)),
  div :global(td:nth-child(5), th:nth-child(5)),
  div :global(td:nth-child(6), th:nth-child(6)),
  div :global(td:nth-child(7), th:nth-child(7)) {
    @apply hidden;
  }
  @screen lg {
    div :global(td:nth-child(2), th:nth-child(2)),
    div :global(td:nth-child(3), th:nth-child(3)),
    div :global(td:nth-child(4), th:nth-child(4)),
    div :global(td:nth-child(5), th:nth-child(5)),
    div :global(td:nth-child(6), th:nth-child(6)),
    div :global(td:nth-child(7), th:nth-child(7)) {
      @apply table-cell;
    }
  } */
</style>

<Tabs>
  <TabList>
    <Tab>Spells</Tab>
    <Tab>Rituals</Tab>
  </TabList>
  <TabPanel>
    <div>
      <List
        on:additem={addSpell}
        title="Spells"
        component={Spell}
        editor={SpellEditor}
        list={spellList.contents.arr}
        display="table">
        <colgroup slot="colgroup">
          <col class="w-full" />
          <col span="6" />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <tr slot="header">
          <th scope="col">Spells</th>
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
    </div>
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
</Tabs>
