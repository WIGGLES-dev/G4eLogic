<script>
    import { getContext } from "svelte";
    import { tooltip } from "@internal";
    import Bar from "./Bar";

    const { character } = getContext("editor");

    $: order = ($character.config.UI || {}).poolOrder;
    const pools$ = character.pools$;
</script>

<style>
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

<section class="grid grid-cols-4 gap-y-1">
    <span class="text-center text-white bg-gray-700">POOL</span>
    <span class="text-center text-white bg-gray-700">CUR</span>
    <span class="text-center text-white bg-gray-700">MAX</span>
    <span class="text-center text-white bg-gray-700">MOD</span>
    {#each order ? order
              .map((attr) => $pools$[attr])
              .filter(
                  (val) => val
              ) : Object.values($pools$) as attr, i (attr.signature)}
        <div class="col-span-2">
            <div class="w-full flex">
                <span
                    use:tooltip={{ context: attr, placement: 'bottom-start', tipclass: 'text-sm', tooltip: `${attr.keys.tooltip}` }}
                    class="text-center w-1/2 inline-block font-semibold uppercase">{attr.keys.abbreviation}
                    {#if attr.keys.costPerLevel}
                        [{attr.pointsSpent()}]
                    {/if}</span>
                <input
                    class="current-input"
                    type="number"
                    placeholder="0"
                    bind:value={attr.currentValue} />
            </div>
        </div>
        <input
            class="max-input"
            type="number"
            min="0"
            placeholder="0"
            bind:value={attr.displayLevel} />
        <input
            type="number"
            placeholder="0"
            bind:value={attr.modifier}
            class="mod-input" />
        <div
            class="col-span-4 relative h-3 rounded-r-md border-b border-solid border-gray-700">
            <Bar
                max={attr.displayLevel}
                current={attr.currentValue}
                color={attr.keys.color} />
        </div>
    {/each}
</section>
