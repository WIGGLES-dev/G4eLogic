<script lang="ts">
    import { Character, System, Crud } from "@internal";
    import { Observable } from "rxjs";
    const sheets$ = System.collections.get("character").instances$ as Observable<Character[]>;
</script>

<style>
    .delete {
        @apply bg-red-700;
    }
</style>

<div class="p-3">
    <div class="flex-1 p-2 grid grid-cols-8 gap-2">
        {#each $sheets$ as sheet, i (sheet.id)}
            <div>
                <h3 class="text-center text-xl">
                    {sheet.getKeys().profile.name || '???'}
                </h3>
                <div class="text-center">[{sheet.getKeys().pointTotal}]</div>
                <button
                    class="button"
                    on:click={e => sheet.edit()}>Edit</button>
                <button
                    class="button delete"
                    on:click={e => sheet.delete()}>Delete</button>
                <span class="fas fa-download" />
                <img
                    src={sheet.getKeys().profile.portrait || 'silhouette.png'}
                    class="pb-2"
                    alt="" />
            </div>
        {/each}
    </div>
</div>