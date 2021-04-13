<script lang="ts">
    import type { Remote } from "comlink";
    import { getContext } from "svelte";
    import Meter from "@components/Form/Meter.svelte";
    import { System } from "@internal";
    import { Character as CharacterWorker } from "@app/gurps/resources/character";
    import {
        filter,
        mergeAll,
        mergeMap,
        pluck,
        startWith,
        switchMap,
    } from "rxjs/operators";
    import { State } from "rxdeep";
    import Popper from "@components/Popper.svelte";
    import { from, Observable, using } from "rxjs";
    import { interpolate } from "@app/utils/strings";
    import { Character } from "@internal";
    import { getEditorContext } from "@ui/editors/Editor.svelte";
    const { state, processed$ } = getEditorContext<Character>();
    const order$ = state.pipe(pluck("config", "ui", "poolOrder"));
    $: pools =
        $order$
            ?.map((attr) => ($processed$?.attributes ?? {})[attr])
            ?.filter((v) => !!v) ?? [];
    let classList = "";
    export { classList as class };
</script>

<table class={classList}>
    <caption>
        <!--  -->
    </caption>
    <thead>
        <tr class="bg-gray-700 text-white">
            <th>POOL</th>
            <th>CUR</th>
            <th>MAX</th>
            <th>MOD</th>
        </tr>
    </thead>
    <tbody>
        {#each pools as attr, i (attr.name)}
            <tr>
                <td>
                    {attr.keys.abbreviation}
                    {#if attr.keys.costPerLevel}
                        [{attr.pointsSpent}]
                    {/if}
                    <Popper
                        display="hovered virtual"
                        offset={[16, 16]}
                        placement="bottom-end"
                    >
                        <div class="tooltip">
                            {@html interpolate(attr.keys.tooltip, attr)}
                        </div>
                    </Popper>
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
            </tr>
            <tr>
                <td colspan="4">
                    <Meter
                        class="col-span-4 w-full"
                        max={attr.level}
                        value={attr.current}
                        color={attr.keys.color}
                    />
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style lang="postcss">
    input {
        @apply text-center w-10;
    }
    .current-input {
    }
    .max-input {
    }
    .mod-input {
    }
</style>
