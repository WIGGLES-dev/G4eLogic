<script lang="ts">
    import { createPopper } from '@popperjs/core';
    import { ContextMenuOption } from "./ContextMenu.svelte";
    import Cell from '@components/Cell.svelte';
    export let option: ContextMenuOption;
    export let close: () => void
    function click(e: MouseEvent) {
        if (typeof option.callback === 'function') option.callback();
        if (!option.interactive) close();
    }
    function renderSubMenu(e: MouseEvent) {
        subOptionsRendered = true;

    }
    let menuItemElement: HTMLLIElement
    let subMenuElement: HTMLUListElement;
    let subOptionsRendered = false;
    $: if (subMenuElement instanceof HTMLElement) {
        createPopper(menuItemElement, subMenuElement, {
            placement: 'right-start',
            strategy: 'fixed'
        })
    }
</script>

<style>

</style>
   
{#if typeof option.show === 'function' ? option.show() : true }
    <li class="px-1 text-white flex" on:click|stopPropagation={click} bind:this={menuItemElement}>
        <Cell value={option.label}/>
        {#if option.options instanceof Array}
            <div class="px-1 h-full" on:click|capture|stopPropagation={renderSubMenu} style=''>
                <span class="fas fa-angle-right text-white" />
            </div>
        {/if}
    </li>
    {#if subOptionsRendered}
        <ul class="bg-gray-500 p-1 rounded" bind:this={subMenuElement}>
            {#each option.options as option}
                <svelte:self {option} {close} />
            {/each}
        </ul>
    {/if}
{/if}