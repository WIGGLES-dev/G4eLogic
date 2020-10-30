<script>
    import { Valor } from "@valor/valor";
    import { makeLocationObject } from "@sheet/locations";
    export let location;
    export let entity = null;
</script>

<style>
</style>

<select name="" id="" bind:value={location}>
    <option value="" />
    {#each makeLocationObject(Valor.getConfig(entity).locations) as { location, isGroup, subLocations }, i (i)}
        {#if isGroup}
            <option class="text-2xl" value="location">
                {location}
            </option>
            {#each subLocations as subLocation, i (i)}
                <option value={subLocation}>{subLocation}</option>
            {/each}
        {/if}
    {/each}
</select>
