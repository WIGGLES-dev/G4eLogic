<script context='module' lang='ts'>

</script>

<script>
    export let fields;
    export let groupBy = Object.keys(fields);
</script>

<style>

</style>

<form>
    {#each groupBy as group, i (i)}
        <!--  -->
    {/each}
</form>