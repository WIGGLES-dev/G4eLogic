<script>
  import { getContext } from "svelte";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import TraitEditor from "@ui/components/editors/TraitEditor";
  import Trait from "@ui/components/entities/Trait";

  const { character } = getContext("app");

  let traitList = character.traitList;

  character.Hooks.on(`generate trait list`, (list) => {
    traitList = list;
  });
</script>

<Tabs>
  <TabList>
    <Tab>Traits</Tab>
    <Tab>Trait Overviews</Tab>
  </TabList>
  <TabPanel>
    <List
      title="Traits"
      component={Trait}
      editor={TraitEditor}
      list={traitList.contents.arr}>
      <tr slot="header">
        <th>Advantages & Disadvantages</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </TabPanel>
  <TabPanel>
    
  </TabPanel>
</Tabs>
