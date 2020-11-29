<script>
    import { Valor, EntityType } from "@internal";
    import Sheet from "@ui/sheet.svelte";
    import Editor from "@ui/editors/Editor.svelte";
    const { state$ } = Valor;
    $: id = $state$.currentlyEditingId;
    $: type = $state$.currentlyEditingType;
</script>

<style>
</style>

{#if type === EntityType.Sheet}
    <Sheet {id} />
{:else}
    <Editor {id} {type} />
{/if}
