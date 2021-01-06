<script lang='ts' context='module'>
    import { Resource, MeleeWeapon } from '@internal';
    import { deleteResource, editResource, meleeWeapon } from '@ui/fieldConfig';
    const meleeWeaponMap = {
        attributes: meleeWeapon,
        context: [
            editResource,
            deleteResource
        ]
    };
</script>

<script lang='ts'>
    import ResourceList from '@ui/datatables/Resource.svelte';
    export let resource: Resource
    export let maxDepth =1;
    $: items$ = resource.selectChildren({
        type: MeleeWeapon.type,
        maxDepth,
        caster: MeleeWeapon
    });
</script>

<style>

</style>

<ResourceList 
    type={MeleeWeapon.type}
    treeMap={meleeWeaponMap} 
    host={resource} 
    resources={items$}
/>
