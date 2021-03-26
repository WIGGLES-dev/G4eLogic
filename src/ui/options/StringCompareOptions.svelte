<script lang="ts">
    import { StringCompare } from "@utils/strings";
    export let option: string;
</script>

<select name="" id="" bind:value={option}>
    <option value={undefined} />
    {#each Object.values(StringCompare) as compareType, i (i)}
        <option value={compareType}>{compareType}</option>
    {/each}
</select>

<style>
</style>
