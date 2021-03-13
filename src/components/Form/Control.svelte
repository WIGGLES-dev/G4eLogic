<script context="module" lang="ts">
    import { SvelteComponent } from "svelte";
</script>

<script lang="ts">
    export let name = "";
    export let id;
    export let value;
    export let type: "number" | "checkbox" | "text" | "select" | "textarea";
    export let cols = 30;
    export let rows = 10;
    export let multiple: boolean;
    export let sub: string[] | string;
    export function change() {}
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
    <span>{name}</span>
    <slot>
        {#if type === "select"}
            <select {name} {id} {multiple}>
                <slot name="option" />
            </select>
        {:else if type === "textarea"}
            <textarea {name} {id} {cols} {rows} />
        {:else}
            <input {type} {name} {id} />
        {/if}
    </slot>
</label>

<!-- svelte-ignore a11y-label-has-associated-control -->
<style>
</style>
