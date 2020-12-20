<script lang="ts">
    import { ContextMenuOption } from "./ContextMenu.svelte";
    export let option: ContextMenuOption;
    function click(e) {
        option.callback();
    }
</script>

<style>

</style>

{#if option.show()}
    <li class="p-2 text-white bg-gray-500 hover:bg-red-500" on:click|capture={click}>
        {option.label}
    </li>
    {#if option.options}
        <ul>
            {#each option.options as option, i (i)}
                <svelte:self {option} />
            {/each}
        </ul>
    {/if}
{/if}