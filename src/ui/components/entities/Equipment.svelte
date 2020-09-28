<script>
  import { getContext } from "svelte";

  import { Text, Number, Checkbox } from "@ui/index";
  import { fixed6 } from "@ui/utils/formatting";

  export let entity = null;

  const { display, config } = getContext("list");
  const {
    components: { contextMenu, modals },
  } = getContext("app");

  const contextMenuOptions = [{}];
</script>

<style>
</style>

{#if $display === 'table'}
  <td>
    <div class="table-cell-inner">
      <Checkbox bind:checked={entity.equipped} />
    </div>
  </td>
  <td>
    <div class="table-cell-inner">
      <Number bind:value={$entity.quantity} />
    </div>
  </td>
  <td class="main-col">
    <div
      style="padding-left:{$entity.getItemDepth() * 20 + 10}px;"
      class="table-cell-inner">
      <slot name="toggle" />
      <Text bind:value={$entity.name} />
    </div>
  </td>
  <td>
    <div class="table-cell-inner">
      <Number bind:value={$entity.uses} min="0" />
    </div>
  </td>
  <td>
    <div class="table-cell-inner">
      <Number bind:value={$entity.value} step="1" min="0" />
      <!-- {fixed6($entity.value)} -->
    </div>
  </td>
  <td>
    <div class="table-cell-inner">
      <Number bind:value={$entity.weight} step="1" min="0" />
    </div>
  </td>
  <td>
    <div class="table-cell-inner">${fixed6($entity.extendedValue())}</div>
  </td>
  <td>
    <div class="table-cell-inner">{fixed6($entity.extendedWeight())} lb.</div>
  </td>
  <td>
    <div class="table-cell-inner">
      <Text bind:value={$entity.reference} />
    </div>
  </td>
{:else if $display === 'list'}
  <span>{$entity.name}</span>
{:else if $display === 'grid'}
  <div style="
  flex: 1
  padding-left:{$entity.getItemDepth() * 10}px
  ">
    {$entity.name}
  </div>
{/if}
