<script lang="ts">
  let classList = "";
  export { classList as class };
</script>

<nav class={classList}>
  <slot />
</nav>

<style lang="postcss">
  nav {
    @apply flex flex-wrap w-full;
  }
  nav > * {
    @apply p-2 underline;
  }
</style>
