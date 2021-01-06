<script context="module" lang="ts">
    import { reduce, map, pluck, mergeMap, tap } from "rxjs/operators";
    import { combineLatest, EMPTY, from } from 'rxjs';
    import { Character, Skill, SkillLike, mapEach, each, AutoSubscriber } from "@internal";
    import Resource, { ResourceTreeMap } from './Resource.svelte';
    import {
        skill,
        deleteResource,
        editResource,
        makeContainer,
        undoMakeContainer
    } from "@ui/fieldConfig";
    export const skillMap= {
        attributes: {
            ...skill
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
    const skills$ = character.selectChildren({type: 'skill', caster: Skill, maxDepth: 1})
</script>

<Resource 
    type="skill"
    resources={skills$}
    host={character}
    treeMap={skillMap}
    toggle="name"
/>