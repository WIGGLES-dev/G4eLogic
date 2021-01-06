<script lang='ts'>
    import { Observable } from 'rxjs';
    export let value: Observable<boolean>
</script>

<style>

</style>

<input type="checkbox" bind:checked={$value} />