<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    function dispatchCardClick(e: MouseEvent) {
        dispatch("click", e);
    }
</script>

<section class="card" on:click={dispatchCardClick}>
    <header>
        <slot name="header" />
    </header>

    <div class="card-content">
        <slot name="content" />
    </div>
    <footer>
        <slot name="footer" />
    </footer>
</section>

<style lang="postcss">
    .card {
        @apply m-2 p-2 rounded-xl bg-gray-200 shadow-xl flex flex-col hover:outline-black;
    }
    .card-content {
        @apply flex-1;
    }
</style>
