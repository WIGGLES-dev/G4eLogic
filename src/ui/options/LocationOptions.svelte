<script lang="ts">
    import { parseHitLocations, Resource } from "@internal";
    export let location: string;
    export let entity: Resource = null;
    const host$ = entity.getNearest("sheet");
    $: hitLocations = Object.entries(
        parseHitLocations($host$.config.locations)
    );
</script>

<style>
</style>

<select bind:value={location}>
    <option value={undefined} />
    {#each hitLocations as [location, { isGroup, subLocations }], i (i)}
        {#if isGroup}
            <option class="text-2xl" value={location}>{location}</option>
            {#each subLocations as subLocation, i (i)}
                <option value={subLocation}>{subLocation}</option>
            {/each}
        {/if}
    {/each}
</select>
