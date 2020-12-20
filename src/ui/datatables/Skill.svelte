<script context="module" lang="ts">
    import { reduce, map, pluck, mergeMap, tap } from "rxjs/operators";
    import { combineLatest, EMPTY, from } from 'rxjs';
    import { Character, Skill, SkillLike, mapEach, each, AutoSubscriber } from "@internal";
    import Resource, { ResourceTreeMap } from './Resource.svelte';
    import {
        reference,
        points,
        difficulty,
        signature,
        mod,
        rsl,
        level,
        name
    } from "@ui/fieldConfig";
    import {
        deleteResource,
        makeContainer,
        undoMakeContainer
    } from "@ui/contextMenuOptions"
    export const skillMap= {
        attributes: {
            reference,
            points,
            difficulty,
            signature,
            mod,
            rsl,
            level,
            name
        },
        context: [
            deleteResource,
            makeContainer,
            undoMakeContainer
        ]
    }
</script>
<script lang="ts">
    export let character: Character;
</script>

<Resource 
    type="skill"
    cast={Skill}
    host={character}
    treeMap={skillMap}
    toggle="name"
/>