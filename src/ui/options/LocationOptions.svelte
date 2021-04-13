<script lang="ts">
    import { load } from "js-yaml";
    import { parseHitLocations } from "@app/gurps/resources/characterConfig";
    import type { Remote } from "comlink";
    import { iif, Observable } from "rxjs";
    import { map, mergeMap, startWith, switchMap } from "rxjs/operators";
    import { getContext } from "svelte";
    export let location: string[] = [];
    $: if (!Array.isArray(location)) {
        location = typeof location === "string" ? [location] : [];
    }
    import Editor, { editorctx } from "@ui/editors/Editor.svelte";
    import Select from "svelte-select";
    import { Character } from "@internal";
    import { getEditorContext } from "@ui/editors/Editor.svelte";
    const { processed$ } = getEditorContext<Character>();
    const hitLocations$ = processed$.pipe(
        mergeMap(async (p) => {
            const { type, config } = p?.data ?? {};
            if (type === "character") {
                return config?.locations;
            } else {
                const request = await fetch(
                    "schemas/gurps/defaultCharacterConfig.yaml"
                );
                const text = await request.text();
                const config = load(text);
                return config?.locations ?? {};
            }
        }),
        map(parseHitLocations),
        startWith({})
    );
    $: items = Object.entries($hitLocations$)?.map(([label, value]) => ({
        label,
        value,
    }));
    $: selectedValue = location?.map((label) => ({
        label,
        value: $hitLocations$[label],
    }));
    function handleSelect(event) {
        const { detail } = event;
        console.log(detail);
        location = detail.map((opt) => opt.value.location);
    }
</script>

<Select {items} {selectedValue} on:select={handleSelect} isMulti={true} />

<style>
</style>
