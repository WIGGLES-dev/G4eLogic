<script context='module' lang='ts'>
    import { SvelteComponent } from 'svelte';
    import Cell, { Component } from '@components/Cell.svelte';
</script>

<script lang='ts'>
    export let name = '';
    export let value
    export let type
</script>

<style>

</style>

<label>
    <input {type} />
</label>