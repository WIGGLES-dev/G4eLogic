<script>
    import { getContext } from "svelte";
    import { createTooltip } from "@ui/utils/popper";
    import Bar from "./Bar";

    const { character } = getContext("editor");
    const pools = character.pools$;
</script>

<style>
    .grid {
        height: min-content;
    }
    .pool {
        @apply duration-300;
        transition-property: width;
    }
    .overflow {
    }
    .low {
    }
</style>

<section class="grid grid-cols-4 gap-y-1">
    <span class="text-center text-white bg-gray-700">POOL</span>
    <span class="text-center text-white bg-gray-700">CUR</span>
    <span class="text-center text-white bg-gray-700">MAX</span>
    <span class="text-center text-white bg-gray-700">MOD</span>
    {#each Object.values($pools) as attr, i (attr.signature)}
        <div class="col-span-2">
            <div class="w-full flex">
                <span
                    use:createTooltip={{ context: attr, placement: 'bottom-start', tipclass: 'text-sm', tooltip: `${attr.keys.tooltip}` }}
                    class="text-center w-1/2 inline-block font-semibold uppercase">{attr.keys.abbreviation}
                    {#if attr.keys.costPerLevel}
                        [{attr.pointsSpent()}]
                    {/if}</span>
                <input
                    class="bg-transparent w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none"
                    type="number"
                    bind:value={attr.currentValue} />
            </div>
        </div>
        <input
            class="w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none"
            type="number"
            bind:value={attr.displayLevel} />
        <input
            type="number"
            bind:value={attr.modifier}
            class="w-10 m-auto text-sm border-b border-gray-700 border-solid text-center outline-none" />
        <div
            class="col-span-4 relative h-3 rounded-r-md border-b border-solid border-gray-700">
            <Bar
                max={attr.displayLevel}
                current={attr.currentValue}
                color={attr.keys.color} />
        </div>
    {/each}
</section>
