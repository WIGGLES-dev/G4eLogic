<Table let:bind>
  <colgroup>
    <col>
    <col>
    <col>
    <col>
    <col>
    <col>
    <col>
    <col>
    <col>
  </colgroup>
  <thead class='pb-2 children:underline'>
    <tr>
      <td />
      <TH id='name'>Usage</TH>
      <TH id='damage'>Damage</TH>
      <TH id='type'>Type</TH>
      <TH id='strength'>Strength</TH>
      <td colspan={4} />
    </tr>
  </thead>
  <TBody 
    nested={false}
    state$={meleeWeapons$}
    let:itemValue
    let:itemState
    let:remove
    let:depth
  >
    <tr slot="header">
      <td colspan={6} />
      <th>
        <div>Parry</div>
        <div>Block</div>
      </th>
      <th>Strength</th>
      <th>Reach</th>
    </tr>
    <TR 
      class="shadow-inner children:hover:shadow-md"
      let:toggleExpanded
    >
      <td>
        <i 
          class="fas fa-ellipsis-v w-full p-2 text-center text-2xl hover:text-white hover:bg-red-700" 
          on:click={toggleExpanded}
        />
      </td>
      <TD key='usage' contenteditable={true} />
      <TD key='damageType' let:cellState>
        <select use:bind={cellState}>
          <option value="imp">imp</option>
          <option value="cr">cr</option>
          <option value="cut">cut</option>
          <option value="fat">fat</option>
          <option value="tox">tox</option>
        </select>
      </TD>
      <TD key='strengthRequirement' contenteditable={true} />
      <td>
        <input class='w-full' type="number" use:bind={itemState.sub('parryBonus')} />
        <input class='w-full' type="number" use:bind={itemState.sub('blockBonus')} />
      </td>
      <TD key='strengthRequirement' contenteditable={true} />
      <TD key='reach' contenteditable={true} />
      <td>
        <i
          class="fas fa-trash p-2 text-center hover:bg-red-700 hover:text-white" 
          on:click={remove} 
        />
      </td>
      <template use:fragment slot='expanded' >
        <MeleeWeaponEditor state$={itemState} />
      </template>
    </TR>
  </TBody>
  <TBody 
    nested={false}
    state$={rangedWeapons$}
    let:itemValue={modifier}
    let:itemState
    let:depth
    let:remove
  >
    <tr slot="header">
      <td colspan={6} />
      <th>
        <div>Range</div>
        <div>Accuracy</div>
      </th>
      <th>
        <div>ROF</div>
        <div>Shots</div>
      </th>
      <th>
        <div>Recoil</div>
        <div>Bulk</div>
      </th>
    </tr>
    <TR 
      class="shadow-inner children:hover:shadow-md"
      let:toggleExpanded
    >
      <td>
        <i class="fas fa-ellipsis-v w-full p-2 text-center text-2xl hover:text-white hover:bg-red-700" on:click={e => toggleExpanded()}/>
      </td>
      <TD key='usage' contenteditable={true} />
      <TD key='damageType' let:cellState>
        <select use:bind={cellState}>
          <option value="imp">imp</option>
          <option value="cr">cr</option>
          <option value="cut">cut</option>
          <option value="fat">fat</option>
          <option value="tox">tox</option>
        </select>
      </TD>
      <TD key='strengthRequirement' contenteditable={true} />
      <td>
        <input type="text" use:bind={itemState.sub('range')} />
        <input type="text" use:bind={itemState.sub('accuracy')} />
      </td>
      <td>
        <input type="text" use:bind={itemState.sub('rateOfFire')} />
        <input type="text" use:bind={itemState.sub('shots')} />
      </td>
      <td>
        <input type="text" use:bind={itemState.sub('recoil')} />
        <input type="text" use:bind={itemState.sub('bulk')} />
      </td>
      <td>
        <i 
          class="fas fa-trash p-2 text-center hover:bg-red-700 hover:text-white" 
          on:click={e => remove()} 
        />
      </td>
      <template use:fragment slot='expanded'>
        <RangedWeaponEditor state$={itemState} />
      </template>
    </TR>
  </TBody>
</Table>
<style>
  
</style>
<script context="module" lang="ts">
  import { State } from 'rxdeep';
  import { Table, THead, TFoot, TBody, TR, Item, TD, TH } from '@components/Table/table';
  import { fragment } from '@internal';
  import MeleeWeaponEditor from '@ui/editors/MeleeWeaponEditor.svelte';
  import RangedWeaponEditor from '@ui/editors/RangedWeaponEditor.svelte';
</script>
<script lang="ts">
  export let state$: State<any>
  export const meleeWeapons$ = state$.sub('weapons', 'melee');
  export const rangedWeapons$ = state$.sub('weapons', 'ranged');
</script>