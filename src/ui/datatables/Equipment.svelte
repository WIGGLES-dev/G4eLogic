<script context="module" lang="ts">
    import { reduce, map, pluck, mergeMap, tap, startWith, withLatestFrom, scan, mergeScan, switchMap } from "rxjs/operators";
    import { combineLatest, EMPTY, from, zip } from 'rxjs';
    import { Character, Equipment, Resolver } from "@internal";
    import Resource, { ResourceTreeMap } from './Resource.svelte';
    import {
        equipment,
        editResource,
        deleteResource,
        makeContainer,
        undoMakeContainer,
    } from "@ui/fieldConfig";
    const relocateEquipment = {
        label: new Resolver((item: Equipment) => `Move to ${item.value.location === 'other' ? 'carried' : 'other'}`),
        callback: new Resolver((item: Equipment) => () => {
            item.moveToLocation(item.value.location === 'other' ? 'carried': 'other')
        }),
        show: () => true
    }
    export const equipmentMap= {
        attributes: {
            ...equipment
        },
        context: [
            editResource,
            makeContainer,
            relocateEquipment,
            undoMakeContainer,
            deleteResource
        ]
    }
</script>
<script lang="ts">
    export let character: Character;
    const filter$ = character.subFlag('ui', 'equipmentFilter');
    const children$ = character.selectChildren({type: 'equipment', caster: Equipment, maxDepth: 1});
    const locations$ = children$.pipe(
        mergeMap(items => combineLatest(items.map(item => item.sub('location')))),
        startWith([])
    );
    const equipment$ = combineLatest([filter$, children$, locations$])
        .pipe(
            map(([filter, items, locations]) => 
                items.filter((item,i) => item.value.location === filter)   
            )
        )
</script>

<Resource 
    type="equipment"
    host={character}
    resources={equipment$}
    treeMap={equipmentMap}
    toggle="name"
/>