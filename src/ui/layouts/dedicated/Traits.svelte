<script>
  import { getContext } from "svelte";
  import List from "@ui/lists/List";

  import TraitEditor from "@ui/editors/TraitEditor";

  import Trait from "@ui/entities/Trait";
  import Language from "@ui/entities/Language";

  import { strEncodeUTF16 } from "@utils/strings";

  const { character } = getContext("editor");

  $: traitList = $character.traitList;

  $: splits = traitList.split();

  $: languages = traitList
    .iter()
    .filter((trait) => /language/i.test([...trait.categories].toString()))
    .sort((a, b) => strEncodeUTF16(b.name) - strEncodeUTF16(a.name));

  $: cultures = traitList
    .iter()
    .filter((trait) => /culture/i.test([...trait.categories].toString()))
    .sort((a, b) => strEncodeUTF16(b.name) - strEncodeUTF16(a.name));

  function addItem(categories) {
    traitList.addListItem().categories = categories;
  }
</script>

<div class="lg:flex">
  <div class="flex-1">
    <List
      category="Advantage"
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
  <div class="w-1/5">
    <List
      category="Language"
      config={{ addItem: false }}
      list={languages}
      component={Language}
      editor={TraitEditor}>
      <tr slot="header">
        <th class="w-full">Languages</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
    <List
      category="Culture"
      config={{ addItem: false }}
      list={cultures}
      component={Trait}
      editor={TraitEditor}>
      <tr slot="header">
        <th class="w-full">Cultures</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="flex-1">
    <List
      category="Disadvantage"
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

<div class="lg:flex">
  <div class="lg:flex-1">
    <List
      category="Racial"
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
  </div>

  <div class="flex-1">
    <List
      category="Meta"
      on:additem={() => addItem(['Meta'])}
      title="Meta"
      component={Trait}
      editor={TraitEditor}
      list={splits.meta}
      config={{ flat: false }}>
      <tr slot="header">
        <th class="w-full">Meta</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
</div>
<div class="lg:flex">
  <div class="flex-1">
    <List
      category="Perk"
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
  <div class="lg:flex-1">
    <List
      category="Quirk"
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
      category="Feature"
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
