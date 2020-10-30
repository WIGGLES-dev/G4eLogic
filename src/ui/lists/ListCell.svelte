<script>
  import { getContext } from "svelte";

  const { display } = getContext("list");
</script>

<style>
    
</style>

{#if display === 'table'}
  <td>
    <slot />
  </td>
{:else if display === 'list'}
  <li>
    <slot />
  </li>
{:else if display === 'grid'}
  <div>
    <slot />
  </div>
{/if}
