<script context="module" lang="ts">
    import { Observable } from "rxjs";
    export function isStore(obj: any): obj is Observable<any> {
        return typeof obj === "object" && "subscribe" in obj && typeof obj.subscribe === "function" 
    }
</script>
<script lang="ts">
    export let observable: Observable<any>
    const isObservable = isStore(observable);
    $: value = isObservable ? $observable : observable;
</script>

<slot {value}>
    {#if !isObservable}
        {observable}
    {:else if $observable == null}
        <!--  -->
    {:else if isStore($observable)}
        <svelte:self let:value observable={$observable}/>
    {:else}
        {$observable}
    {/if}
</slot>