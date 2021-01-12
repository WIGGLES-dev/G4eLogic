<script context='module' lang='ts'>
    import { KeyedState, State } from 'rxdeep';
</script>
<script lang='ts'>
    import { Table, Header, HCell, Body, Row, TCell } from '@components/Table/table';
    import Cell from '@components/Cell.svelte';
    import ContextMenu from 'svelte';
    export let components: Record<string,any> = {};
    export let context: Record<string,any> = {};
    export let header: any[] = [];
    export let src: any[] = [];
    export let items = src;
    export const state$ = new KeyedState(new State(src), (_) => _.id);
    export let contextmenu
    function renderContextMenu() {
        return context;
    }
    $: items = $state$;
</script>

<style>

</style>

<Table>
    <Header>
        {#each header as head, i (i)}
            <HCell>
                <!--  -->
            </HCell>
        {/each}
    </Header>
    <Body>
        {#each $state$ as item, i (item.id)}
            <Row>
                {#each Object.entries(item) as [key,value], i (i)}
                    <TCell>
                        <Cell component={components[key]} {value} {...value}/>
                    </TCell>
                {/each}
            </Row>
        {/each}
    </Body>
</Table>
<ContextMenu bind:this={contextmenu}>

</ContextMenu>