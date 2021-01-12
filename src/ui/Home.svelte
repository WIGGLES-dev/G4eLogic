<script lang="ts">
    import { Character, System, Crud } from "@internal";
    import { Observable } from "rxjs";
    import { link } from 'svelte-spa-router'
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
                    {sheet.value.profile.name || '???'}
                </h3>
                <div class="text-center">[{sheet.value.pointTotal}]</div>
                <a href='/edit/{sheet.type}/{sheet.id}/' use:link>Edit</a>
                <button class="button delete" on:click={e => sheet.delete()}>Delete</button>
                <span class="fas fa-download" on:click={e => sheet.dump()}/>
                <img
                    src={sheet.value.profile.portrait || 'silhouette.png'}
                    class="pb-2"
                    alt="" />
            </div>
        {/each}
    </div>
</div>