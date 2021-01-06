<script context='module' lang='ts'>
 import {
        trait,
        deleteResource,
        makeContainer,
        undoMakeContainer,
        editResource,
        changeTraitCategory
    } from "@ui/fieldConfig";
  export const traitMap= {
      attributes: {
          ...trait
      },
      context: [
          editResource,
          changeTraitCategory,
          makeContainer,
          undoMakeContainer,
          deleteResource,
      ]
    }
  export const advantageMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Advantages'
      }
    },
    context: traitMap.context
  };
  export const perkMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Perks'
      }
    },
    context: traitMap.context
  };
  export const disadvantageMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Disadvantages'
      }
    },
    context: traitMap.context
  };
  export const quirkMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Quirks'
      }
    },
    context: traitMap.context
  };
  export const languageMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Languages'
      }
    },
    context: traitMap.context
  };
  export const cultureMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Culture'
      }
    },
    context: traitMap.context
  };
  export const racialMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Racial'
      }
    },
    context: traitMap.context
  };
  export const metaMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Meta'
      }
    },
    context: traitMap.context
  };
  export const featureMap = {
    attributes: {
      ...trait,
      name: {
        ...trait.name,
        header: 'Feature'
      }
    },
    context: traitMap.context
  };
</script>
<script lang="ts">
  import { getContext } from "svelte";
  import {
    map,
    mergeMap,
    pluck,
    startWith
  } from 'rxjs/operators';
  import {
    split,
    Character,
    Trait,
    TraitCategory,
    log
  } from "@internal";
  import Resource from '@ui/datatables/Resource.svelte';
import { combineLatest } from "rxjs";
  const character = getContext<Character>("sheet");
  const traits$ = character.selectChildren({type:'trait', caster: Trait, maxDepth: 1});
  const splits$ = traits$.pipe(
    mergeMap(
      ta => ta.length > 0 ? combineLatest(ta.map(t => t.instance$)) : [[]]
    ),
    map(split)
  );
  const advantages = splits$.pipe(pluck(TraitCategory.Advantage));
  const disadvantages = splits$.pipe(pluck(TraitCategory.Disadavantage));
  const racial = splits$.pipe(pluck(TraitCategory.Racial));
  const meta = splits$.pipe(pluck(TraitCategory.Meta));
  const perks = splits$.pipe(pluck(TraitCategory.Perk));
  const quirks = splits$.pipe(pluck(TraitCategory.Quirk));
  const features = splits$.pipe(pluck(TraitCategory.Feature));
</script>

<div class="lg:flex">
  <div class="flex-1">
    <!-- ADVANTAGES -->
    <Resource 
      type='trait'
      toggle='name'
      host={character}
      resources={advantages}
      treeMap={advantageMap}
      createMergeData={{
        categories: [TraitCategory.Advantage]
      }}
    />
  </div>
  <div class="w-1/5">
    <!-- LANGUAGES -->
    <!-- CULTURES -->
  </div>
  <div class="flex-1">
    <!-- DISADVANTAGES -->
    <Resource
      type='trait'
      toggle='name'
      host={character}
      resources={disadvantages}
      treeMap={disadvantageMap}
      createMergeData={{
        categories: [TraitCategory.Disadavantage]
      }}
    />
  </div>
</div>

<div class="lg:flex">
  <div class="lg:flex-1">
    <!-- RACIAL -->
    <Resource
      type='trait'
      toggle='name'
      host={character}
      resources={racial}
      treeMap={racialMap}
      createMergeData={{
        categories: [TraitCategory.Racial]
      }}
    />
  </div>

  <div class="flex-1">
    <!-- META -->
    <Resource 
      type='trait'
      toggle='name'
      host={character}
      resources={meta}
      treeMap={metaMap}
      createMergeData={{
        categories: [TraitCategory.Meta]
      }}
    />
  </div>
</div>
<div class="lg:flex">
  <div class="flex-1">
    <!-- PERKS -->
    <Resource 
      type='trait'
      toggle='name'
      host={character}
      resources={perks}
      treeMap={perkMap}
      createMergeData={{
        categories: [TraitCategory.Perk]
      }}
    />
  </div>
  <div class="lg:flex-1">
    <!-- QUIRKS -->
    <Resource
      type='trait'
      toggle='name'
      host={character}
      resources={quirks}
      treeMap={quirkMap}
      createMergeData={{
        categories: [TraitCategory.Quirk]
      }}
    />
  </div>
  <div class="flex-1">
    <!-- FEATURES -->
    <Resource
      type='trait'
      toggle='name'
      host={character}
      resources={features}
      treeMap={featureMap}
      createMergeData={{
        categories: [TraitCategory.Feature]
      }}
    />
  </div>
</div>