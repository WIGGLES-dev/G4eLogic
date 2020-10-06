<script>
  import { getContext } from "svelte";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import TraitEditor from "@ui/components/editors/TraitEditor";
  import Trait from "@ui/components/entities/Trait";

  const { character } = getContext("app");

  $: traitList = $character.traitList;

  $: splits = traitList.split();

  function addItem(categories) {
    traitList.addListItem().categories = categories;
  }
</script>

<List
  on:additem={() => addItem(['Racial'])}
  title="Racial"
  component={Trait}
  editor={TraitEditor}
  list={splits.racial}
  config={{ flat: false }}>
  <tr slot="header">
    <th class="w-full">Racial</th>
    <th>Lvl</th>
    <th>Pts</th>
    <th>Ref</th>
  </tr>
</List>
<div class="flex">
  <div class="flex-1">
    <List
      on:additem={() => addItem(['Perk'])}
      title="Perks"
      component={Trait}
      editor={TraitEditor}
      list={splits.perks}
      config={{ flat: false }}>
      <tr slot="header">
        <th class="w-full">Perks</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="flex-1">
    <List
      on:additem={() => addItem(['Quirk'])}
      title="Quirks"
      component={Trait}
      editor={TraitEditor}
      list={splits.quirks}
      config={{ flat: false }}>
      <tr slot="header">
        <th class="w-full">Quirks</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="flex-1">
    <List
      on:additem={() => addItem(['Feature'])}
      title="Features"
      component={Trait}
      editor={TraitEditor}
      list={splits.features || []}>
      <tr slot="header">
        <th class="w-full">Features</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
</div>
<div class="flex">
  <div class="flex-1">
    <List
      on:additem={() => addItem(['Advantage'])}
      title="Advantages"
      component={Trait}
      editor={TraitEditor}
      list={splits.advantages}
      config={{ flat: false }}>
      <tr slot="header">
        <th class="w-full">Advantages</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="flex-1">
    <List
      on:additem={() => addItem(['Disadvantage'])}
      title="Disadvantages"
      component={Trait}
      editor={TraitEditor}
      list={splits.disadvantages}
      config={{ flat: false }}>
      <tr slot="header">
        <th class="w-full">Disadvantages</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
</div>

<!-- <Tabs>
  <TabList>
    <Tab>Traits</Tab>
    <Tab>Trait Overviews</Tab>
  </TabList>
  <TabPanel>
  </TabPanel>
  <TabPanel />
</Tabs> -->
