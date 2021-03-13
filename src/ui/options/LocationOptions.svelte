<script lang="ts">
    import { parseHitLocations, Resource, Character } from "@internal";
    import { map, mergeMap } from "rxjs/operators";
    export let location: string;
    export let entity: Resource = null;
    const host$ = entity.root$<Character>();
    const hitLocations$ = host$.pipe(
        mergeMap((char) => char.sub("config").sub("locations")),
        map(parseHitLocations),
        map((hl) => Object.entries(hl))
    );
</script>

<select bind:value={location}>
    <option value={undefined} />
    {#each $hitLocations$ as [location, { isGroup, subLocations }], i (i)}
        {#if isGroup}
            <option class="text-2xl" value={location}>{location}</option>
            {#each subLocations as subLocation, i (i)}
                <option value={subLocation}>{subLocation}</option>
            {/each}
        {/if}
    {/each}
</select>

<style>
</style>
