<script lang="ts">
    import { load } from "js-yaml";
    import { parseHitLocations } from "@app/gurps/resources/characterConfig";
    import { Remote } from "comlink";
    import { iif, Observable } from "rxjs";
    import { map, mergeMap, startWith, switchMap } from "rxjs/operators";
    import { getContext } from "svelte";
    export let location: string;
    const worker = getContext<Observable<Remote<any>>>("worker");
    const hitLocations$ = worker.pipe(
        mergeMap(async (worker) => {
            const { type, config } = await worker.getValue();
            if (type === "character") {
                return config?.locations;
            } else {
                const request = await fetch(
                    "schemas/gurps/defaultCharacterConfig.yaml"
                );
                const text = await request.text();
                const config = load(text);
                return config?.locations;
            }
        }),
        map(parseHitLocations),
        map(Object.entries),
        startWith([])
    );
</script>

<select bind:value={location}>
    <option value={undefined} />
    {#each $hitLocations$ as [location, { isGroup, subLocations }], i (i)}
        <option class="" value={location}>{location}</option>
    {/each}
</select>

<style>
</style>
