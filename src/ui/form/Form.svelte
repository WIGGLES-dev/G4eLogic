<script>
</script>

<style>
    form :global(label) {
        @apply flex p-2;
    }

    form :global(div.flex label),
    form :global(input) {
        @apply flex-1;
    }

    form :global(input),
    form :global(select) {
        @apply border-b border-black border-solid outline-none ml-1;
    }

    form :global(input) {
        @apply h-full pl-1;
    }

    form :global(textarea) {
        @apply outline-none border border-black border-solid rounded mt-2 w-full;
    }
</style>

<form class="p-3" action="">
    <slot />
</form>
