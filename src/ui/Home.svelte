<script lang="ts">
    import { v4 } from "uuid";
    import { System, fetchTable, validateResource } from "@internal";
    import { download } from "@utils/dom";
    import { from } from "rxjs";
    import { switchAll } from "rxjs/operators";
    import { link, push } from "svelte-spa-router";
    import { db } from "@app/database";
    import Popper from "@components/Popper.svelte";
    import { fade } from "svelte/transition";
    const table$ = from(fetchTable<any>("index"));
    $: table = $table$;
    const sheets$ = table$.pipe(switchAll());
    function createCharacter() {
        const id = v4();
        const data = {
            id,
            type: "character",
        };
        System.add("index", data, id);
    }
    async function downloadCharacter(id) {
        const obj = await System.get("index", id);
        const str = JSON.stringify(obj);
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], {
            type: "application/json;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        download(url, `${obj.name}.json`);
    }
    function uploadValorCharacter() {}
</script>

<div class="m-4">
    <menu>
        <button on:click={createCharacter}> Create New Character </button>
        <button> Load Valor File </button>
        <button> Load GCS File </button>
    </menu>

    {#if $sheets$ && $sheets$ instanceof Array}
        <div
            class="grid gap-2 grid-flow-col auto-cols-max auto-rows-min flex-1 p-2 select-none"
        >
            {#each $sheets$ as sheet, i (sheet.id)}
                {#if sheet.type === "character"}
                    <div
                        class="border border-solid border-gray-700 text-gray-700 flex flex-col"
                    >
                        <div class="text-center bg-gray-700 text-white">
                            {sheet.name || "???"}{" ["}{sheet.pointTotal}{"]"}
                            <i class="fas fa-search float-right p-1 text-white">
                                <Popper
                                    display="hovered virtual"
                                    placement="bottom-end"
                                    modifiers={[
                                        {
                                            name: "offset",
                                            options: {
                                                offset: [16, 16],
                                            },
                                        },
                                    ]}
                                >
                                    <div
                                        class="bg-gray-700 text-white text-sm p-2"
                                    >
                                        <div>
                                            created on: {new Date(
                                                sheet.__meta__.createdOn
                                            )}
                                        </div>
                                        <div>
                                            last edited on: {new Date(
                                                sheet.__meta__.lastEdit
                                            )}
                                        </div>
                                    </div>
                                </Popper>
                            </i>
                        </div>
                        <img
                            src={sheet.image || "assets/silhouette.png"}
                            class="p-2 object-contain flex-1 max-h-96"
                            alt="portrait"
                        />
                        <div
                            class="
                                flex
                                children:py-1
                                bg-gray-700
                                children:text-white
                                children:text-center
                                children:flex-1
                                children:cursor-pointer
                                children:hover:bg-gray-200
                                justify-center
                            "
                        >
                            <i
                                class="fas fa-edit hover:text-gray-700"
                                on:click={(e) =>
                                    push(`/edit/${sheet.type}/${sheet.id}/`)}
                            />
                            <i
                                class="fas fa-download hover:text-gray-700"
                                on:click={(e) => downloadCharacter(sheet.id)}
                            />
                            <i
                                class="fas fa-trash hover:text-red-700"
                                on:click={(e) =>
                                    System.db.table("index").delete(sheet.id)}
                            />
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
</style>
