<script lang='ts'>
  import { Resource, Resolver } from '@internal';
  import { formatTraitModifierCost } from '@ui/fieldConfig'
  import { map } from 'rxjs/operators';
  import { State } from 'rxdeep';
  import { Table, Header, Footer, Body, Row, TCell, HCell } from '@components/Table/table';
  import ContextMenu from '@components/ContextMenu/ContextMenu.svelte'
  export let entity: Resource;
  const modifiers$ = entity.sub('modifiers') as State<any[]>;
  let contextmenu: ContextMenu;
  function addModifier() {
    modifiers$.value = [...modifiers$.value || [], {}];
  }
  function renderContextMenu(e: MouseEvent) {
    e.preventDefault();
    const target = e.target as HTMLTableRowElement;
    const { rowIndex } = target.closest('tr');
    const options =  [{
      label: 'Edit',
      callback: () => {}
    },{
      label: "Delete",
      callback: () =>  modifiers$.next(modifiers$.value.filter((v,i) => i !== rowIndex - 1))
    }];
    contextmenu.update(e);
    contextmenu.$set({options, rendered: true});
  }
</script>

<style>

</style>

<Table class='mx-4'>
  <Header>
    <Row>
      <HCell>Enabled</HCell>
      <HCell class='w-full'>Modifier</HCell>
      <HCell>Cost</HCell>
      <HCell>Ref</HCell>
    </Row>
  </Header>
  <Body>
    {#each $modifiers$ as modifier, i (i)}
      <Row on:contextmenu={renderContextMenu} class='even:bg-gray-100 relative p-0'>
        <TCell><input type="checkbox" bind:checked={modifier.enabled} /></TCell>
        <TCell><input type="text" class='w-full' bind:value={modifier.name} /></TCell>
        <TCell>{formatTraitModifierCost(modifier)}</TCell>
        <TCell><input type="text" bind:value={modifier.reference}></TCell>
      </Row>
    {/each}
  </Body>
  <Footer>
    <Row>
      <span on:click={addModifier} class="fas fa-plus text-red-700"></span>
    </Row>
  </Footer>
</Table>
<ContextMenu bind:this={contextmenu} />