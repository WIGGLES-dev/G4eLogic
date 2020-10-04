<script>
  import { getContext } from "svelte";
  import { List, Tabs, Tab, TabList, TabPanel } from "@ui/index";

  import TraitEditor from "@ui/components/editors/TraitEditor";
  import Trait from "@ui/components/entities/Trait";

  const { character } = getContext("app");

  $: traitList = $character.traitList.iter();

  $: splits = () => {
    let advantages = traitList.filter((trait) => trait.isAdvantage());
    let disadvantages = traitList.filter((trait) => trait.isDisadvantage());
    let quirks = traitList.filter((trait) => trait.isQuirk());
    let perks = traitList.filter((trait) => trait.isPerk());
    let features = traitList.filter((trait) => trait.isFeature());
    let racial = traitList.filter((trait) => trait.isRacial());

    let oldSplits = {
      advantages,
      disadvantages,
      quirks,
      perks,
      features,
      racial,
    };

    let newSplits = Object.entries(oldSplits).reduce(
      (prev, [key, split], i, arr) => {
        if (!prev[key]) prev[key] = [];
        let currentSplit = oldSplits[key];

        let otherSplits = Object.values(splits);
        otherSplits.splice(i, 1);
        otherSplits = otherSplits.flat();

        currentSplit.forEach((trait) => {
          if (otherSplits.includes(trait)) {
          } else {
            prev[key] = [...prev[key], trait];
          }
        });
        return prev;
      },
      {}
    );

    //console.log(newSplits);

    return newSplits;
  };

  character.Hooks.on(`generate trait list`, (list) => {
    traitList = list;
  });
</script>

<List
  title="Advantages"
  component={Trait}
  editor={TraitEditor}
  list={splits().advantages}
  config={{ flat: true }}>
  <tr slot="header">
    <th class="w-full">Advantages</th>
    <th>Pts</th>
    <th>Ref</th>
  </tr>
</List>
<div class="flex">
  <div class="w-1/2">
    <List
      title="Perks"
      component={Trait}
      editor={TraitEditor}
      list={splits().perks}
      config={{ flat: true }}>
      <tr slot="header">
        <th class="w-full">Perks</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="w-1/2">
    <List
      title="Quirks"
      component={Trait}
      editor={TraitEditor}
      list={splits().quirks}
      config={{ flat: true }}>
      <tr slot="header">
        <th class="w-full">Quirks</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
</div>
<List
  title="Disadvantages"
  component={Trait}
  editor={TraitEditor}
  list={splits().disadvantages}
  config={{ flat: true }}>
  <tr slot="header">
    <th class="w-full">Disadvantages</th>
    <th>Pts</th>
    <th>Ref</th>
  </tr>
</List>
<List
  title="Racial"
  component={Trait}
  editor={TraitEditor}
  list={splits().racial}
  config={{ flat: true }}>
  <tr slot="header">
    <th class="w-full">Racial</th>
    <th>Pts</th>
    <th>Ref</th>
  </tr>
</List>

<!-- <Tabs>
  <TabList>
    <Tab>Traits</Tab>
    <Tab>Trait Overviews</Tab>
  </TabList>
  <TabPanel>
  </TabPanel>
  <TabPanel />
</Tabs> -->
