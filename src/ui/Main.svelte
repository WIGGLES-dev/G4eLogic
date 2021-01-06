<script lang='ts'>
    import Sidebar from '@components/Sidebar/Sidebar.svelte';
    import { System } from '@internal';
    const view$ = System.state.sub('view');
    $: view = {
        component: System.components.get($view$.component),
        props: $view$.props
    }
    function setViewHome() {
        System.state.sub('view').value = {
            component: 'home'
        }
    }
    function createCharacter() {
        System.crud.create({type: 'character'});
    }
    function gotoLastView() {
        System.view.last();
    }
</script>

<style>
    .sidebar-button {
        @apply px-2 py-4 text-white text-lg text-center w-full outline-none;
    }
    .sidebar-button:hover {
        @apply bg-green-500;
    }
</style>

<header>

</header>
<main class='flex-1'>
    <div class="flex h-full">
        <Sidebar width='220px'>
            <img slot='top' src="favicon.png" class='h-20 m-auto pt-2' alt="" on:click={setViewHome} />
            <button class='sidebar-button' on:click={createCharacter}>Make New Character</button>
            <button class='sidebar-button disabled'>Upload Character</button>
            <button class='sidebar-button disabled'>Upload GCS Files</button>
            <button class='sidebar-button disabled'>View Documentation</button>
            <div slot="bottom" class='flex text-center text-white'>
                <span class="fas fa-arrow-left flex-1 hover:bg-gray-400 p-3" on:click={gotoLastView}></span>
                <span class="fas fa-home flex-1 hover:bg-gray-400 p-3" on:click={setViewHome}></span>
            </div>
        </Sidebar>
        <div class='flex-1'>
            <svelte:component this={view.component} {...view.props} />
        </div>
    </div>
</main>
<footer>
    
</footer>