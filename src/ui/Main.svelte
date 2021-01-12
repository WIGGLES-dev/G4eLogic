<script lang='ts'>
    import Sidebar from '@components/Sidebar/Sidebar.svelte';
    import { System } from '@internal';
    import Router from 'svelte-spa-router'
    import Editor from '@ui/editors/Editor.svelte';
    import Home from '@ui/Home.svelte';
    import { push, pop, replace } from 'svelte-spa-router'
    function setViewHome() {
        push('/')
    }
    function createCharacter() {
        System.crud.create({type: 'character'});
    }
    const routes = {
        '/': Home,
        '/edit/:type/:id/*': Editor
    };
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
                <span class="fas fa-arrow-left flex-1 hover:bg-gray-400 p-3" on:click={pop}></span>
                <span class="fas fa-home flex-1 hover:bg-gray-400 p-3" on:click={setViewHome}></span>
            </div>
        </Sidebar>
        <div class='flex-1'>
            <Router {routes} /> 
        </div>
    </div>
</main>
<footer>
    
</footer>