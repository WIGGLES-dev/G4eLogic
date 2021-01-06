<script lang='ts'>
    import { } from 'rxjs';
    import { setContext } from 'svelte'; 
    let classList: string
    export { classList as class }
    $: context = {
        
    };

</script>

<style>

</style>

<table class='{classList}'>
    <slot>
        
    </slot>
</table>