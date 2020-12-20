<script context="module" lang="ts">
    import { Observable } from 'rxjs';
    import { map, tap } from 'rxjs/operators'
    import { Resource, GConstructor, Registry } from "@internal";
    import TreeGrid, { ItemAttribute, Label, TreeItem } from "@components/TreeGrid/TreeGrid.svelte";
    import { ContextMenuOption } from "@components/ContextMenu/ContextMenu.svelte";
    import { Resolver, Resolvable } from '@ui/fieldConfig';
    export interface ResourceTreeMap {
        attributes: {
            [key: string]: {
                header?: ItemAttribute
                width?: string
            } & ItemAttribute
        }
        context?: ContextMenuOption[]
        classList?: string
        headerContext?: ContextMenuOption[]
        headerClassList?: string
    }
    function resourceToAttribute(resource: Resource, treeMap: Resolvable<ResourceTreeMap>): TreeItem {
        const resolvedMap = Resolver.deepResolve(treeMap, [resource]);
        const {
            id,
            canContainChildren,
            flags: {
                ui: {
                    weight = null,
                    toggled = false
                } = {}
            } = {}
        } = resource.getMetadata();
        const attributes =
            Object.fromEntries(
                Object.entries(resolvedMap.attributes).map(([key, attribute]) => [
                    key,
                    attribute
                ])
            );
        return {
            attributes,
            context: resolvedMap.context,
            weight,
            id,
            toggled,
            showToggle: canContainChildren,
            classList: resolvedMap.classList,
            children: resourceToTree(resource, resource.type, resource.class, treeMap).pipe(
                map(t => t.slice(1))
            )
        }
    }
    function resourceToTree(resource: Resource, type: string, cast: GConstructor<Resource>, treeMap: Resolvable<ResourceTreeMap>): Observable<TreeItem[]> {
        const resolvedMap = Resolver.deepResolve(treeMap, [resource]);
        const children$ = resource.selectChildren(type, cast);
        return children$.pipe(
            map(ra => {
                const header = 
                    Object.fromEntries(
                        Object.entries(resolvedMap.attributes).map(([key, { header }]) => [key, header || key])
                    );
                return [{
                        attributes: header,
                        context: resolvedMap.headerContext,
                        classList: resolvedMap.headerClassList
                    },
                    ...ra.map(
                        r => resourceToAttribute(r, resolvedMap)
                    )]
            }),
        ) as Observable<TreeItem[]>;
    }
</script>
<script lang="ts">
    import { applyTransaction } from "@datorama/akita";
    export let host: Resource;
    export let type: string;
    export let cast: GConstructor<Resource>;
    export let treeMap: Resolvable<ResourceTreeMap>;
    export let toggle;
    $: widths = Object.fromEntries(
        Object.entries(treeMap.attributes).map(([key,value]) => [
            key,
            value.width
        ])
    );
    const items$ = resourceToTree(host, type, cast, treeMap);
    $: items = $items$;
    function sortList(e) {
        const {
            from,
            to,
            newList,
            currentList
        } = e.detail;
        applyTransaction(() => {
            if (from.id === to.id) return
            newList.forEach((item,i) => {
                if (item) {
                    new Resource({
                        type,
                        id: item.id
                    }).setFlag('ui', 'weight', i)
                }
            });
            new Resource({
                    type,
                    id: from.id
                }).transfer({
                    type,
                    id: to.id
                });
        });
    }
    function addItem() {
        host.embed({
            type
        });
    }
</script>

<TreeGrid
    on:additem={addItem}
    on:sortlist={sortList}
    {toggle}
    {widths}
    {items}
/>