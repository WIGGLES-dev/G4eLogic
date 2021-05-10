<script lang="ts">
  import { onMount, getContext, afterUpdate } from "svelte";
  import LocationBox from "./LocationBox.svelte";
  import type { HitLocation, Character, CharacterData } from "@internal";
  import Popper from "@components/Popper.svelte";
  import { map, mergeMap, pluck, startWith, tap } from "rxjs/operators";
  import SVG from "./SVG.svelte";
  import { capitalize } from "@app/utils/strings";
  import Editor, { editorctx } from "@app/ui/Editor.svelte";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { state, processed$ } = getEditorContext<Character>();
  const hitLocations$ = processed$.pipe(pluck("hitLocations"));
  export let height = "100%";
  export let width = "100%";
  export let minWidth: string = "0px";
  export let maxHeight: string = "100%";
  export let viewBox = "0 0 800 800";
  export let scale = "1";
  let focusedLocation;
  let draw;
  let silhouette;
  const pass = {
    height,
    width,
    minWidth,
    maxHeight,
    viewBox,
    scale,
  };
  $: [...Object.values($hitLocations$ || {})].forEach(
    (location: HitLocation) => {
      if (!draw) return;
      const svg = draw.find(
        `[data-location-group="${location.name
          .split(" ")
          .join("-")}"],[data-location="${location.name.split(" ").join("-")}"]`
      );
      if (!svg) return;
      if (location.isCrippled) {
        svg.addClass("crippled");
      } else {
        svg.removeClass("crippled");
      }
    }
  );
  $: leftLocations = ["head", "left arm", "left leg"];
  $: rightLocations = ["torso", "right arm", "right leg"];
  $: allLocations = [...leftLocations, ...rightLocations];
  $: allSilhoueteLocations = allLocations.reduce(
    (silhoueteLocations, location) => [
      ...silhoueteLocations,
      location,
      ...(($hitLocations$ || {})[location]?.subLocations?.map(
        (location) => location?.name
      ) ?? ([] as string[])),
    ],
    [] as string[]
  );

  $: getLocations = () => {
    function mapLocations(list: string[]): HitLocation[] {
      return [
        ...list.reduce((_locations, location) => {
          if (
            $hitLocations$[focusedLocation] &&
            $hitLocations$[focusedLocation].name === location
          ) {
            $hitLocations$[focusedLocation].subLocations.forEach((location) =>
              _locations.add(location)
            );
          } else if (!focusedLocation) {
            _locations.add($hitLocations$[location]);
          }
          return _locations;
        }, new Set<HitLocation>()),
      ].filter((value) => !!value);
    }
    return {
      left: mapLocations(leftLocations),
      right: mapLocations(rightLocations),
      other: [...Object.values($hitLocations$ || {})].filter(
        (location: HitLocation) => {
          return !allSilhoueteLocations.includes(location.name);
        }
      ) as HitLocation[],
      visible: mapLocations(allLocations),
    };
  };
  $: references = {};
  function addAllLocationReferences() {
    if (!draw) return;
    const locationGroups = draw.find(`[data-location-group]`);
    const locations = draw.find(`[data-location]`);
    [...locationGroups, ...locations].forEach((svg) => {
      const dataset = svg.node.dataset;
      const name = dataset.locationGroup || dataset.location;
      references[name] = svg.node;
    });
  }
  onMount(addAllLocationReferences);
  afterUpdate(addAllLocationReferences);
</script>

<svelte:window />

{#if $hitLocations$}
  {#each Object.values($hitLocations$ || {}) as location}
    {#if references[location.name] && getLocations()
        .visible.map((l) => l.name)
        .includes(location.name)}
      <Popper
        reference="{references[location.name]}"
        display="hovered virtual"
        offset="{[16, 16]}"
        let:popper
      >
        <div class="tooltip" use:popper>
          <strong>
            {capitalize(location.name)}
            {#if location.keys.hitPenalty}
              ({location.keys.hitPenalty})
            {/if}
          </strong>
          {#if location.keys.hitRange instanceof Array && location.keys.hitRange.length > 0}
            [{location.keys.hitRange}]
            {#if typeof location.keys.hitPenalty === "number"}
              ({location.keys.hitPenalty})
            {/if}
          {/if}
          <br />
          <strong>
            DR {location.damageResistance || 0}
            <!-- FROM NATURAL DR -->
          </strong>
          <br />
          {#if location.crippleThreshold > 0}
            <strong>{location.damageTaken || 0}</strong>/{Math.floor(
              location.crippleThreshold
            )} to cripple
            <br />
          {/if}
          <strong>Armor Equipped</strong>
          <blockquote>
            <!-- ARMOR EQUIPPED SYNOPSIS -->
          </blockquote>

          <strong>Extended Rules</strong>
          <blockquote>
            <!-- EXTENDED RULES INFORMATION -->
          </blockquote>
        </div>
      </Popper>
    {/if}
  {/each}

  <section class="w-min">
    <div class="flex">
      <div class="location-bar">
        {#each getLocations().left as location, i (location.name)}
          <LocationBox location="{location}" />
        {/each}
      </div>
      <SVG {...pass} bind:draw bind:silhouette bind:focusedLocation />
      <div class="location-bar">
        {#each getLocations().right as location, i (location.name)}
          <LocationBox location="{location}" />
        {/each}
      </div>
    </div>

    <div class="w-full grid grid-cols-4">
      {#each getLocations().other as location, i (location)}
        <LocationBox location="{location}" />
      {/each}
    </div>
  </section>
{/if}

<style lang="postcss">
  .location-bar {
    @apply flex flex-col flex-wrap max-h-full w-20;
  }
</style>
