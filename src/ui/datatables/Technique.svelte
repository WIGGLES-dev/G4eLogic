<script context="module" lang="ts">
    import { reduce, map, pluck, mergeMap, tap } from "rxjs/operators";
    import { combineLatest, EMPTY, from } from 'rxjs';
    import { Character, Technique, SkillLike, mapEach, each, AutoSubscriber } from "@internal";
    import Resource, { ResourceTreeMap } from './Resource.svelte';
    import {
        technique,
        deleteResource,
        editResource,
        makeContainer,
        undoMakeContainer
    } from "@ui/fieldConfig";
    export const skillMap= {
        attributes: {
            ...technique
        },
        context: [
            editResource,
            makeContainer,
            undoMakeContainer,
            deleteResource
        ]
    }
</script>
<script lang="ts">
    export let character: Character;
    const techniques$ = character.selectChildren({type: 'technique', caster: Technique, maxDepth: 1});
</script>

<Resource 
    type="technique"
    resources={techniques$}
    host={character}
    treeMap={skillMap}
    toggle="name"
/>