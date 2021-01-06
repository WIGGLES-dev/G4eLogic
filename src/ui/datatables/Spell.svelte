<script context='module' lang='ts'>
    import { Spell, Character } from '@internal';
    import {
        spell,
        deleteResource,
        editResource,
        makeContainer,
        undoMakeContainer
    } from '@ui/fieldConfig';
    const spellMap = {
        attributes: {
            ...spell
        },
        context: [
            editResource,
            makeContainer,
            undoMakeContainer,
            deleteResource
        ]
    }
</script>

<script lang='ts'>
    import Resource from '@ui/datatables/Resource.svelte';
    export let character: Character;
    const spells$ = character.selectChildren({type: 'spell', caster: Spell, maxDepth: 1});
</script>

<Resource 
    type='spell'
    resources={spells$}
    host={character}
    treeMap={spellMap}
    toggle='spell'
/>