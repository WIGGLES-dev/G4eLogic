<Table
  class='mx-4'
  let:contextmenu
  let:bind
  let:columns
>
  <colgroup>
    <col>
    <col>
    <col class='w-full'>
    <col>
    <col>
  </colgroup>
  <thead class='pb-2 children:underline'>
    <tr>
      <td />
      <TH id='enabled'>E</TH>
      <TH id='name'>Modifier</TH>
      <TH id='cost'>Cost</TH>
      <TH id='reference'>Reference</TH>
      <td />
    </tr>
  </thead>
  <TBody
    nested={false}
    state$={modifiers$}
    let:itemValue={modifier}
    let:itemState
    let:remove
    let:depth
  >
    <TR 
      class='shadow-inner children:hover:shadow-md'
      let:toggleExpanded
    >
      <td>
        <i
          class="fas fa-ellipsis-v w-full p-2 text-center text-2xl hover:text-white hover:bg-red-700" 
          on:click={e => toggleExpanded()}
        />
      </td>
      <TD key='enabled' contenteditable={true} />
      <TD key='name' contenteditable={true} />
      <td class='whitespace-nowrap'>
          <output>
            {formatTraitModifierCost(modifier)}
          </output>
      </td>
      <TD key='reference' contenteditable={true} />
      <td>
        <i class="fas fa-trash p-2 text-center hover:bg-red-700 hover:text-white" on:click={e => remove()} />
      </td>
      <template use:fragment slot='expanded'>
        <TraitModifierEditor state$={itemState} />
      </template>
    </TR>
  </TBody>
</Table>
<style>
  
</style>
<script context="module" lang="ts">
  import { Resource, Resolver, bind, fragment } from '@internal';
  import { map } from 'rxjs/operators';
  import { State } from 'rxdeep';
  import { Table, THead, TFoot, TBody, TR, Item, TD, TH } from '@components/Table/table';
  import { Checkbox, Number, Text } from '@components/Form/form';
  import TraitModifierEditor from '@ui/editors/TraitModifierEditor.svelte';
  import Toggle from '@components/Toggle.svelte';
</script>
<script lang='ts'>
  export let entity: Resource;
  export const modifiers$ = entity.sub('modifiers');
</script>
