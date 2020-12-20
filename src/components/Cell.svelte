<script context="module" lang="ts">
  
</script>
<script lang="ts">
    import Observe, {isStore} from "@components/Observe.svelte";
    import { SvelteComponent } from "svelte";
    export let value: any;
</script>

{#if value == null}
    <!--  -->
{:else if typeof value === "string"}
    {value}
{:else if typeof value === "number"}
    {value}
{:else if typeof value === "function"}
    <svelte:self value={value()} />
{:else}
    {#if isStore(value)}
        <Observe observable={value} let:value={nestedValue}>
            <svelte:self value={nestedValue}/>
        </Observe>
    {:else if value.component}
        <svelte:component this={value.component} {...value.props} {...value} />
    {:else}
        <svelte:component this={value} />
    {/if}
{/if}