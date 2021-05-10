<script lang="ts">
  import { load } from "js-yaml";
  import { map, mergeMap, startWith, switchMap } from "rxjs/operators";
  import { getContext } from "svelte";
  export let attribute: string = null;
  export let signaturesOnly = false;
  import { Character } from "@internal";
  import { getEditorContext } from "@app/ui/Editor.svelte";
  const { processed$ } = getEditorContext<Character>();
  const attributes$ = processed$.pipe(
    mergeMap(async (p) => {
      const { type, config } = p?.data ?? {};
      if (type === "character") {
        return config?.attributes;
      } else {
        const request = await fetch(
          "schemas/gurps/defaultCharacterConfig.yaml"
        );
        const text = await request.text();
        const config = load(text);
        return config?.attributes;
      }
    }),
    map(Object.entries),
    startWith([])
  );
</script>

<select bind:value="{attribute}">
  <option value="{null}"></option>
  {#each $attributes$ as [signature, { skillSignature, abbreviation }], i (i)}
    {#if signaturesOnly ? skillSignature : true}
      <option value="{signature}">{abbreviation || signature}</option>
    {/if}
  {/each}
  <slot />
</select>

<style lang="postcss">
</style>
