<script context="module" lang="ts">
    export enum InputType {
        Text = "text",
        Number = "number",
        Checkbox = "checkbox"
    }
    function evaluateType(value: any): InputType {
        return InputType.Text
    }
</script>
<script lang="ts">
    import {isStore} from "@components/Observe.svelte";
    export let value: any
    export let type: InputType;
    export let width
    $: deterministicWidth = () => {
        if (width) return width
        const characters = isStore(value) ? $value : value;
        return `${Math.max((characters || "").toString().length * 20, 40)}px`
    }
    const userSelectedType: InputType = Object.values(InputType).includes(type) ? type : undefined
    const evaluatedType: InputType = evaluateType(userSelectedType ? undefined : isStore(value) ? evaluateType($value)  : evaluateType(value));
    const effectiveType: InputType = userSelectedType || evaluatedType;
    $: style = `
        flex: 1;
        width: ${width};
    `
</script>

<style>
    input {
        background-color: --backgroundColor;
    }
    input:focus {
        @apply outline-none;
    }
</style>

{#if isStore(value)}
    {#if typeof value["set"] === "function"}
        {#if effectiveType === InputType.Text}
            <input type="text" bind:value={$value} {style}/>
        {:else if effectiveType === InputType.Number}
            <input type="number" bind:value={$value} {style}/>
        {:else if effectiveType === InputType.Checkbox}
            <input type="checkbox" bind:checked={$value} {style}/>
        {/if}
    {:else}
        <input {type} value={$value} {style}/>
    {/if}
{:else}
    <input {type} {value} {style}/>
{/if}