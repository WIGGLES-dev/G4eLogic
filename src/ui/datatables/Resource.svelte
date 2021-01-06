<script context="module" lang="ts">
    import { Observable } from "rxjs";
    import { map, tap } from "rxjs/operators";
    import { 
        Resource,
        keyMap,
        System,
        Resolver, 
        Resolvable 
    } from "@internal";
    import TreeGrid, {
        ItemAttribute,
        TreeItem
    } from "@components/TreeGrid/TreeGrid.svelte";
    import { ContextMenuOption } from "@components/ContextMenu/ContextMenu.svelte";
    export interface ResourceTreeMap {
        attributes: {
            [key: string]: {
                header?: ItemAttribute;
                width?: string;
            } & ItemAttribute;
        };
        context?: ContextMenuOption[];
        classList?: string;
        headerContext?: ContextMenuOption[];
        headerClassList?: string;
    }
    function resourceToAttribute(
        resource: Resource,
        treeMap: Resolvable<ResourceTreeMap>
    ): TreeItem {
        const children$ = resource.selectSameChildren();
        const resolvedMap = Resolver.deepResolve(treeMap, [resource]);
        const toggled = resource.subFlag('ui', 'toggled');
        const showToggle = resource.index.sub('canContainChildren');
        const disabled = resource.index.sub('enabled').pipe(map(b => !b))
        return {
            ctx: resource,
            attributes: resolvedMap.attributes,
            context: resolvedMap.context,
            id: resource.id,
            toggled,
            showToggle,
            classList: resolvedMap.classList,
            disabled,
            children: resourceToTree(
                children$,
                treeMap
            )
        };
    }
    function resourceToTree(
        resources$: Observable<Resource[]>,
        treeMap: Resolvable<ResourceTreeMap>
    ): Observable<TreeItem[]> {
        return resources$.pipe(
            map((ra) => ra.map(r => resourceToAttribute(r, treeMap)))
        );
    }
</script>

<script lang="ts">
    export let host: Resource
    export let type: string
    export let resources: Observable<Resource[]>
    export let treeMap: Resolvable<ResourceTreeMap>;
    export let toggle;
    export let createMergeData = {};
    const resolvedMap = Resolver.deepResolve(treeMap, [host]);
    $: headers = [{
        attributes: keyMap(resolvedMap.attributes, (k,{header}) => [k, header||k]),
        context: resolvedMap.headerContext,
        classList: resolvedMap.headerClassList
    }];
    $: widths =  keyMap(resolvedMap.attributes, (key,value) => [key,value.width]);
    const items$ = resourceToTree(resources, treeMap);
    function sortList({detail: {from, to, newList, currentList}}) {
        if (from.id === to.id) return;
        const reorders = newList.map((item, i) => ({
            id: item.id,
            order: i
        }))
        System.index.update(reorders);
        new Resource({
            type,
            id: from.id,
        }).transfer({
            type,
            id: to.id,
        });
    }
    function onToggle({detail: {id, depth, index, toggled}}) {
        new Resource({id,type}).setFlag('ui', 'toggled', toggled)
    }
    function addItem() {
        host.embed({
            type,
            ...createMergeData
        });
    }
</script>

<TreeGrid
    on:additem={addItem}
    on:sortlist={sortList}
    on:toggle={onToggle}
    {toggle}
    {widths}
    {headers}
    items={$items$}
    groupBy={Object.keys(headers[0].attributes)}
/>
