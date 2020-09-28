<script>
  import { getContext } from "svelte";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import EquipmentEditor from "@ui/components/editors/EquipmentEditor";
  import Equipment from "@ui/components/entities/Equipment";

  const { character } = getContext("app");

  let equipmentList = character.equipmentList;
  let otherEquipmentList = character.otherEquipmentList;

  character.Hooks.on(`generate equipment list`, (list) => {
    equipmentList = list;
  });
  character.Hooks.on(`generate other equipment list`, (list) => {
    otherEquipmentList = list;
  });
</script>

<Tabs>
  <TabList>
    <Tab>Equipment</Tab>
    <Tab>Other Equipment</Tab>
  </TabList>
  <TabPanel>
    <List
      title="Equipment"
      component={Equipment}
      editor={EquipmentEditor}
      list={equipmentList.contents.arr}
      display="table">
      <tr slot="header">
        <th>E</th>
        <th>#</th>
        <th>Description</th>
        <th>Uses</th>
        <th>Value</th>
        <th>Weight</th>
        <th>EValue</th>
        <th>EWeight</th>
        <th>Ref</th>
      </tr>
    </List>
  </TabPanel>
  <List
    title="Other Equipment"
    component={Equipment}
    editor={EquipmentEditor}
    list={otherEquipmentList.contents.arr}
    display="table">
    <tr slot="header">
      <th>E</th>
      <th>#</th>
      <th>Description</th>
      <th>Uses</th>
      <th>Value</th>
      <th>Weight</th>
      <th>EValue</th>
      <th>EWeight</th>
      <th>Ref</th>
    </tr>
  </List>
  <TabPanel />
</Tabs>
