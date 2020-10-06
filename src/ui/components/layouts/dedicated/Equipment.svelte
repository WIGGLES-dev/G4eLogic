<script>
  import { getContext } from "svelte";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import EquipmentEditor from "@ui/components/editors/EquipmentEditor";
  import Equipment from "@ui/components/entities/Equipment";

  const { character } = getContext("app");

  $: equipmentList = $character.equipmentList;
  $: otherEquipmentList = $character.otherEquipmentList;
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
      <colgroup slot="colgroup">
        <col />
        <col />
        <col class="w-full" />
        <col span="6" class="" />
      </colgroup>
      <tr slot="header">
        <th scope="col">E</th>
        <th scope="col">#</th>
        <th scope="col">Description</th>
        <th scope="col">Uses</th>
        <th scope="col">Value</th>
        <th scope="col">Weight</th>
        <th scope="col">EValue</th>
        <th scope="col">EWeight</th>
        <th scope="col">Ref</th>
      </tr>
    </List>
  </TabPanel>
  <TabPanel>
    <List
      title="Other Equipment"
      component={Equipment}
      editor={EquipmentEditor}
      list={otherEquipmentList.contents.arr}
      display="table">
      <colgroup slot="colgroup">
        <col />
        <col />
        <col class="w-full" />
        <col span="6" />
      </colgroup>
      <tr slot="header">
        <th scope="col">E</th>
        <th scope="col">#</th>
        <th scope="col">Description</th>
        <th scope="col">Uses</th>
        <th scope="col">Value</th>
        <th scope="col">Weight</th>
        <th scope="col">EValue</th>
        <th scope="col">EWeight</th>
        <th scope="col">Ref</th>
      </tr>
    </List>
  </TabPanel>
</Tabs>
