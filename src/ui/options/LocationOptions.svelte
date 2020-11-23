<script>
    import { parseHitLocations } from "@internal";
    export let location;
    export let entity = null;
    const { config$ } = entity;
</script>

<style>
</style>

<select bind:value={location}>
    <option value={undefined} />
    {#each Object.entries(parseHitLocations($config$.locations)) as [location, { isGroup, subLocations }], i (i)}
        {#if isGroup}
            <option class="text-2xl" value={location}>{location}</option>
            {#each subLocations as subLocation, i (i)}
                <option value={subLocation}>{subLocation}</option>
            {/each}
        {/if}
    {/each}
</select>
