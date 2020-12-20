<script lang="ts">
  import { getContext } from "svelte";

  import List from "@ui/lists/List.svelte";
  import TraitEntity from "@ui/entities/Trait.svelte";
  import Language from "@ui/entities/Language.svelte";

  import {
    split,
    Trait,
    TraitCategory,
    strEncodeUTF16,
    Valor,
    Sheet,
    FeatureType,
  } from "@internal";
  const sheet = getContext<Sheet>("sheet");
  const { traits$ } = sheet;

  function languages(traits) {
    return traits
      .filter((trait) => /language/i.test(trait.keys.categories.join(" ")))
      .sort((a, b) => strEncodeUTF16(b.name) - strEncodeUTF16(a.name));
  }
  function cultures(traits) {
    return traits
      .filter((trait) => /culture/i.test(trait.keys.categories.join(" ")))
      .sort((a, b) => strEncodeUTF16(b.name) - strEncodeUTF16(a.name));
  }
  function addItem(categories = []) {
    sheet.embed(
      new Trait(null).wrapData({
        keys: {
          categories,
        },
      })
    );
  }
  function getRoot(entities = []) {
    return entities
      .filter((entity) => entity.owner == null)
      .sort((a, b) => a.listWeight - b.listWeight);
  }
  function accessChildren(entity) {
    return entity.sameChildren.sort((a, b) => a.listWeight - b.listWeight);
  }
  $: props = {
    draggable: true,
    addItem: true,
    component: TraitEntity,
    list: $traits$,
    accessChildren,
  };
  $: advantageProps = {
    ...props,
    getRoot: (list) => getRoot(split(list)[TraitCategory.Advantage]),
  };
  $: languageProps = {
    ...props,
    addItem: false,
    getRoot: (list) => getRoot(languages(list)),
    component: Language,
  };
  $: cultureProps = {
    ...props,
    addItem: false,
    getRoot: (list) => getRoot(cultures(list)),
  };
  $: disadvantageProps = {
    ...props,
    getRoot: (list) => getRoot(split(list)[TraitCategory.Disadavantage]),
  };
  $: racialProps = {
    ...props,
    getRoot: (list) => getRoot(split(list)[TraitCategory.Racial]),
  };
  $: metaProps = {
    ...props,
    getRoot: (list) => getRoot(split(list)[TraitCategory.Meta]),
  };
  $: perkProps = {
    ...props,
    getRoot: (list) => getRoot(split(list)[TraitCategory.Perk]),
  };
  $: quirkProps = {
    ...props,
    getRoot: (list) => getRoot(split(list)[TraitCategory.Quirk]),
  };
  $: featureProps = {
    ...props,
    getRoot: (list) => getRoot(split(list)[TraitCategory.Feature]),
  };
</script>

<div class="lg:flex">
  <div class="flex-1">
    <List on:additem={() => addItem(['Advantage'])} {...advantageProps}>
      <tr slot="header">
        <th class="w-full">Advantages</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="w-1/5">
    <List {...languageProps}>
      <tr slot="header">
        <th class="w-full">Languages</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
    <List {...cultureProps}>
      <tr slot="header">
        <th class="w-full">Cultures</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="flex-1">
    <List on:additem={() => addItem(['Disadvantage'])} {...disadvantageProps}>
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
    <List on:additem={() => addItem(['Racial'])} {...racialProps}>
      <tr slot="header">
        <th class="w-full">Racial</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>

  <div class="flex-1">
    <List on:additem={() => addItem(['Meta'])} {...metaProps}>
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
    <List on:additem={() => addItem(['Perk'])} {...perkProps}>
      <tr slot="header">
        <th class="w-full">Perks</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="lg:flex-1">
    <List on:additem={() => addItem(['Quirk'])} {...quirkProps}>
      <tr slot="header">
        <th class="w-full">Quirks</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
  <div class="flex-1">
    <List on:additem={() => addItem(['Feature'])} {...featureProps}>
      <tr slot="header">
        <th class="w-full">Features</th>
        <th>Lvl</th>
        <th>Pts</th>
        <th>Ref</th>
      </tr>
    </List>
  </div>
</div>
