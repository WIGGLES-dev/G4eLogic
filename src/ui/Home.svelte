<script lang="ts">
    import { Character, System } from "@internal";
    import { Observable } from "rxjs";
    import { link } from "svelte-spa-router";
    const sheets$ = System.resources.get("character") as Observable<
        Character[]
    >;
</script>

<div
    class="grid gap-2 grid-flow-col auto-cols-max auto-rows-min flex-1 p-2 select-none"
>
    {#each $sheets$ as sheet, i (sheet.id)}
        <div class="border border-solid border-gray-700 text-gray-700">
            <div class="text-center">
                <span>{sheet.value.profile.name || "???"}</span>
                <span class="pl-2">[{sheet.value.pointTotal}]</span>
            </div>
            <!-- <img
                src={sheet.value.profile.portrait || "silhouette.png"}
                class="p-2 object-contain flex-1 max-h-96"
                alt="portrait"
            /> -->
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
                    on:click={(e) => sheet.dump()}
                />
                <i
                    class="py-1 fas fa-trash hover:text-red-700 cursor-pointer"
                    on:click={(e) => sheet.delete()}
                />
            </div>
        </div>
    {/each}
</div>

<style lang="postcss">
    .fas {
        @apply text-gray-700;
    }
</style>
