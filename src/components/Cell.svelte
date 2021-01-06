<script context="module" lang="ts">
    import { Observable } from 'rxjs';
    import { SvelteComponent } from 'svelte';
    export interface Component {
        component: typeof SvelteComponent
        props?: Record<string,any>
    }
    export type CellValue = string | number | Component | (() => CellValue) | Observable<CellValue>;
</script>
<script lang="ts">
    import Observe, {isStore} from "@components/Observe.svelte";
    export let value: CellValue;
</script>

{#if value == null}
    <!--  -->
{:else if typeof value === "string"}
    {@html value}
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
        <svelte:component this={value.component} {...value} {...value.props} />
    {/if}
{/if}