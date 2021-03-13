<script context="module" lang="ts">
    import { Observable, Subscription } from "rxjs";
    import { SvelteComponent, onMount } from "svelte";
</script>

<script lang="ts">
    export let component: typeof SvelteComponent;
    export let props;
    export let value;
    onMount(() => {
        if (
            typeof value === "object" &&
            typeof value.subscribe === "function"
        ) {
            return value.subscribe((v) => {
                value = v;
            });
        }
    });
</script>

{#if component}
    <svelte:self {value} let:value>
        <svelte:component
            this={component}
            {value}
            {...value}
            {...$$props}
            {...props}
        >
            <slot {value} />
        </svelte:component>
    </svelte:self>
{:else if value instanceof Promise}
    {#await value}
        <slot name="await" {value} />
    {:then value}
        <svelte:self {value} let:value>
            <slot {value} />
        </svelte:self>
    {:catch error}
        <slot name="error" {error} />
    {/await}
{:else if typeof value === "function"}
    <svelte:self value={value()} let:value>
        <slot {value} />
    </svelte:self>
{:else if typeof value === "string" || typeof value === "number"}
    <slot {value}>
        {@html value}
    </slot>
{/if}
