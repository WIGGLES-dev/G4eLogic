<section>
    <ul>
        {#each menu as options, i (i)}
            <li bind:this={menus[i]} on:click={menus[i].render()}>
                MENU
            </li>
            <Menu bind:reference={menuLabels[i]} bind:this={menus[i]} {options}  />
        {/each}
    </ul>
</section>
<style>

</style>
<script context='module' lang='ts'>
    import Menu, { MenuOption } from '@components/Menu/Menu.svelte';
</script>
<script lang='ts'>
    export let menu: any[];
    let menuLabels = [];
    let menus = [];
</script>