<script>
    import { StringCompare } from "@internal";
    export let option;
</script>

<style>
</style>

<select name="" id="" bind:value={option}>
    <option value={undefined} />
    {#each Object.values(StringCompare) as compareType, i (i)}
        <option value={compareType}>{compareType}</option>
    {/each}
</select>
