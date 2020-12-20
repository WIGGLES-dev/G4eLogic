<script lang="ts">
    import { Character, Registry, Crud } from "@internal";
    import { Observable } from "rxjs";
    import Sheet from "./Sheet.svelte";
    const sheets$ = Registry.collections
        .get("character")
        ?.selectInstances() as Observable<Character[]>;
    const active$ = Registry.index.query.selectActive();
</script>

<style>
    .delete {
        @apply bg-red-700;
    }
</style>

{#if $active$}
    <Sheet id={$active$.id} type={$active$.type} />
{:else}
    <div class="p-3">
        <div class="pt-3 flex">
            <div class="flex flex-col">
                <button
                    on:click={(e) => Crud.create({ type: 'character' })}
                    class="button">Make A New Character</button>
                <button class="button disabled">Upload Character</button>
                <button class="button disabled">Upload GCS Files</button>
                <button on:click={() => {}} class="button">View Documentation</button>
            </div>
            <div class="flex-1 p-2 grid grid-cols-8 gap-2">
                {#each $sheets$ as sheet, i (sheet.id)}
                    <div>
                        <h3 class="text-center text-xl">
                            {sheet.getKeys().profile.name || '???'}
                        </h3>
                        <div class="text-center">[{sheet.getKeys().pointTotal}]</div>
                        <button
                            class="button"
                            on:click={(e) => Registry.index.store.setActive([
                                    sheet.id,
                                ])}>Edit</button>
                        <button
                            class="button delete"
                            on:click={(e) => sheet.delete()}>Delete</button>
                        <span class="fas fa-download" />
                        <img
                            src={sheet.getKeys().profile.portrait || 'silhouette.png'}
                            class="pb-2"
                            alt="" />
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
