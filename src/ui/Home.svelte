<script lang="ts">
    import { v4 } from "uuid";
    import { System, fetchTable } from "@internal";
    import { download, upload } from "@utils/dom";
    import { from } from "rxjs";
    import { switchAll } from "rxjs/operators";
    import { link, push } from "svelte-spa-router";
    import { db } from "@app/database";
    import Popper from "@components/Popper.svelte";
    import Card from "@components/Card.svelte";
    import { fade } from "svelte/transition";
    import { character as characterMap } from "@app/gurps/utils";
    import { merge } from "@utils/object-mapper";
    const table$ = from(fetchTable<any>("index"));
    const sheets$ = table$.pipe(switchAll());
    function createCharacter() {
        const id = v4();
        const data = {
            id,
            type: "character",
        };
        System.add("index", data, id);
    }
    async function downloadValorFile(id) {
        const obj = await System.get("index", id);
        const str = JSON.stringify(obj);
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], {
            type: "application/json;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        download(url, `${obj.name}.json`);
    }
    async function uploadValorFile() {
        const files = await upload();
        const file = files[0];
        if (!file) return;
        const text = await file.text();
        try {
            const obj = JSON.parse(text);
            const id = obj.id || v4();
            System.add("index", obj, id);
        } catch (err) {}
    }
    async function uploadGCSFile() {
        const files = await upload();
        const file = files[0];
        if (!file) return;
        const text = await file.text();
        try {
            const obj = JSON.parse(text);
            const character: any = merge(obj, characterMap);
            const id = character.id;
            System.add("index", character, id);
        } catch (err) {}
    }
</script>

<menu>
    <button on:click={createCharacter}> Create New Character </button>
    <button on:click={uploadValorFile}> Load Valor File </button>
    <button on:click={uploadGCSFile}> Load GCS File </button>
</menu>

{#if $sheets$ && $sheets$ instanceof Array}
    <div class="flex flex-wrap m-4">
        {#each $sheets$ as sheet, i (sheet.id)}
            {#if sheet.type === "character"}
                <Card
                    on:click={(e) => push(`/edit/${sheet.type}/${sheet.id}/`)}
                >
                    <div slot="header" class="text-center">
                        <h3>
                            {sheet.name || "???"} [{sheet.pointTotal || 0}]
                        </h3>
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
                            let:reference
                            let:popper
                        >
                            <i class="fas fa-search" use:reference />
                            <div
                                class="bg-gray-700 text-white text-sm p-2"
                                use:popper
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
                    </div>
                    <img
                        class="p-2 object-contain flex-1 max-h-52 min-w-[9rem]"
                        src={sheet.image || "assets/silhouette.png"}
                        alt="portrait"
                        slot="content"
                    />
                    <div
                        slot="footer"
                        class="
                            flex
                            children:py-1
                            bg-gray-500
                            rounded
                            children:text-white
                            children:text-center
                            children:flex-1
                            children:cursor-pointer
                            children:hover:bg-gray-200
                            justify-center
                    "
                    >
                        <i
                            class="fas fa-download hover:text-gray-700"
                            on:click|capture|stopPropagation={(e) =>
                                downloadValorFile(sheet.id)}
                        />
                        <i
                            class="fas fa-trash hover:text-red-700"
                            on:click|capture|stopPropagation={(e) =>
                                System.db.table("index").delete(sheet.id)}
                        />
                    </div>
                </Card>
            {/if}
        {/each}
    </div>
{/if}

<style lang="postcss">
</style>
