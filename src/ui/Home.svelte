<script lang="ts">
    import { v4 } from "uuid";
    import { System, fetchTable, validateResource } from "@internal";
    import { from } from "rxjs";
    import { switchAll } from "rxjs/operators";
    import { link } from "svelte-spa-router";
    import { db } from "@app/database";
    const table$ = from(fetchTable<any>("index"));
    $: table = $table$;
    const sheets$ = table$.pipe(switchAll());
    function createCharacter() {
        const id = v4();
        const data = { id, type: "character" };
        System.add("index", data, id);
    }
</script>

<button class="p-2 bg-gray-700 text-white" on:click={createCharacter}
    >Create New Character</button
>
{#if $sheets$ && $sheets$ instanceof Array}
    <div
        class="grid gap-2 grid-flow-col auto-cols-max auto-rows-min flex-1 p-2 select-none"
    >
        {#each $sheets$ as sheet, i (sheet.id)}
            {#if sheet.type === "character"}
                <div class="border border-solid border-gray-700 text-gray-700">
                    <div class="text-center">
                        <span>{sheet.name || "???"}</span>
                        <span class="pl-2">[{sheet.pointTotal}]</span>
                    </div>
                    <img
                        src={sheet.image || "assets/silhouette.png"}
                        class="p-2 object-contain flex-1 max-h-96"
                        alt="portrait"
                    />
                    <div class="px-2">
                        <a
                            class="underline py-1"
                            href="/edit/{sheet.type}/{sheet.id}/"
                            use:link
                        >
                            <i class="fas fa-edit hover:text-green-700" />
                        </a>
                        <i
                            class="py-1 fas fa-download hover:text-green-700 cursor-pointer"
                        />
                        <i
                            class="py-1 fas fa-trash hover:text-red-700 cursor-pointer"
                            on:click={(e) =>
                                System.db.table("index").delete(sheet.id)}
                        />
                    </div>
                </div>
            {/if}
        {/each}
    </div>
{/if}

<style lang="postcss">
    .fas {
        @apply text-gray-700;
    }
</style>
