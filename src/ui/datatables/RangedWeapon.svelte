<script lang='ts' context='module'>
    import { Resource, RangedWeapon } from '@internal';
    import { deleteResource, editResource, rangedWeapon } from '@ui/fieldConfig';
    const rangedWeaponMap = {
        attributes: rangedWeapon,
        context: [
            editResource,
            deleteResource
        ]
    };
</script>

<script lang='ts'>
    import ResourceList from '@ui/datatables/Resource.svelte';
    export let resource: Resource
    export let maxDepth = 1;
    $: items$ = resource.selectChildren({
        type: RangedWeapon.type,
        maxDepth,
        caster: RangedWeapon
    });
</script>

<style>

</style>

<ResourceList 
    type={RangedWeapon.type}
    treeMap={rangedWeaponMap} 
    host={resource}
    resources={items$}
/>