<script context="module" lang="ts">
  import { getContext } from "svelte";
  import { map, mergeMap, pluck, startWith } from "rxjs/operators";
  import TraitList from "@ui/datatables/Trait.svelte";
</script>

<script lang="ts">
  import { getTraitType, TraitCategory } from "@app/gurps/resources/trait";
  const character = getContext<any>("sheet");
  const advantages = (trait) => getTraitType(trait) === TraitCategory.Advantage;
  const disadvantages = (trait) =>
    getTraitType(trait) === TraitCategory.Disadavantage;
  const racial = (trait) => getTraitType(trait) === TraitCategory.Racial;
  const meta = (trait) => getTraitType(trait) === TraitCategory.Meta;
  const perks = (trait) => getTraitType(trait) === TraitCategory.Perk;
  const quirks = (trait) => getTraitType(trait) === TraitCategory.Quirk;
  const features = (trait) => getTraitType(trait) === TraitCategory.Feature;
</script>

<TraitList root={character}>Traits</TraitList>
{#if false}
  <div class="lg:flex">
    <div class="flex-1">
      <!-- ADVANTAGES -->
      <TraitList
        root={character}
        filterfunc={advantages}
        createMergeData={{
          categories: [TraitCategory.Advantage],
        }}
      >
        Advantages
      </TraitList>
    </div>
    <div class="w-1/5">
      <!-- LANGUAGES -->
      <!-- CULTURES -->
    </div>
    <div class="flex-1">
      <!-- DISADVANTAGES -->
      <TraitList
        root={character}
        filterfunc={disadvantages}
        createMergeData={{
          categories: [TraitCategory.Disadavantage],
        }}
      >
        Disadvantages
      </TraitList>
    </div>
  </div>
  <div class="lg:flex">
    <div class="lg:flex-1">
      <!-- RACIAL -->
      <TraitList
        root={character}
        filterfunc={racial}
        createMergeData={{
          categories: [TraitCategory.Racial],
        }}
      >
        Racial
      </TraitList>
    </div>

    <div class="flex-1">
      <!-- META -->
      <TraitList
        root={character}
        filterfunc={meta}
        createMergeData={{
          categories: [TraitCategory.Meta],
        }}
      >
        Meta
      </TraitList>
    </div>
  </div>
  <div class="lg:flex">
    <div class="flex-1">
      <!-- PERKS -->
      <TraitList
        root={character}
        filterfunc={perks}
        createMergeData={{
          categories: [TraitCategory.Perk],
        }}
      >
        Perks
      </TraitList>
    </div>
    <div class="lg:flex-1">
      <!-- QUIRKS -->
      <TraitList
        root={character}
        filterfunc={quirks}
        createMergeData={{
          categories: [TraitCategory.Quirk],
        }}
      >
        Quirks
      </TraitList>
    </div>
    <div class="flex-1">
      <!-- FEATURES -->
      <TraitList
        root={character}
        filterfunc={features}
        createMergeData={{
          categories: [TraitCategory.Feature],
        }}
      >
        Features
      </TraitList>
    </div>
  </div>
{/if}
