<script lang="ts">
    import { releaseProxy, Remote } from "comlink";
    import { getContext } from "svelte";
    import { tooltip } from "@ui/utils/use";
    import Meter from "@components/Form/Meter.svelte";
    import { System } from "@internal";
    import {
        Character as CharacterWorker,
        Attribute,
    } from "@app/gurps/resources/character";
    import {
        filter,
        mergeMap,
        pluck,
        startWith,
        switchMap,
    } from "rxjs/operators";
    import { State } from "rxdeep";
    import { withComlinkProxy } from "@utils/operators";
    import { from, Observable, using } from "rxjs";
    const state = getContext<State<any>>("sheet");
    const order$: Observable<string[]> = state.pipe(
        pluck("config", "ui", "poolOrder")
    );
    const character$ = getContext<Observable<Remote<CharacterWorker>>>(
        "worker"
    );
    const attributes$ = character$.pipe(
        mergeMap((c) => c.getAttributeCollection())
    );
    $: pools =
        $order$
            ?.map((attr) => ($attributes$ || {})[attr])
            ?.filter((v) => !!v) ?? [];
</script>

<section class="grid grid-cols-4 gap-y-1">
    <span class="text-center text-white bg-gray-700">POOL</span>
    <span class="text-center text-white bg-gray-700">CUR</span>
    <span class="text-center text-white bg-gray-700">MAX</span>
    <span class="text-center text-white bg-gray-700">MOD</span>
    {#each pools as attr, i (attr.name)}
        <div class="col-span-2">
            <div class="w-full flex">
                <span
                    use:tooltip={{
                        context: attr,
                        placement: "bottom-start",
                        tipclass: "text-sm",
                        tooltip: `${attr.keys.tooltip}`,
                    }}
                    class="text-center w-1/2 inline-block font-semibold uppercase"
                    >{attr.keys.abbreviation}
                    {#if attr.keys.costPerLevel}
                        [{attr.pointsSpent}]
                    {/if}</span
                >
                <input
                    class="current-input"
                    type="number"
                    placeholder="0"
                    value={attr.current}
                    on:change={(e) =>
                        state.merge({
                            attributeLevels: {
                                [attr.name]: {
                                    current: +e.target["value"],
                                },
                            },
                        })}
                />
            </div>
        </div>
        <input
            class="max-input"
            type="number"
            min="0"
            placeholder="0"
            value={attr.level}
            on:change={(e) =>
                state.merge({
                    attributeLevels: {
                        [attr.name]: {
                            level:
                                +e.target["value"] -
                                attr.bonus -
                                attr.mod -
                                attr.base,
                        },
                    },
                })}
        />
        <input
            class="mod-input"
            type="number"
            placeholder="0"
            value={attr.mod}
            on:change={(e) =>
                state.merge({
                    attributeLevels: {
                        [attr.name]: {
                            mod: +e.target["value"],
                        },
                    },
                })}
        />
        <div
            class="col-span-4 relative h-3 rounded-r-md border-b border-solid border-gray-700"
        >
            <Meter
                max={attr.level}
                value={attr.current}
                color={attr.keys.color}
            />
        </div>
    {/each}
</section>

<style lang="postcss">
    .grid {
        height: min-content;
    }
    .overflow {
    }

    .low {
    }

    .current-input {
        @apply bg-transparent w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none;
    }
    .max-input {
        @apply w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none;
    }
    .mod-input {
        @apply w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none;
    }
</style>
