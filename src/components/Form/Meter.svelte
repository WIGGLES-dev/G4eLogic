<script lang="ts">
    export let min: number = 0;
    export let max: number = null;
    export let low: number = null;
    export let high: number = null;
    export let optimum: number = null;
    export let value: number = 0;
    export let color: string = null;
    export let classList = "";
    export { classList as class };
    $: style = `
        --optimum-value-color: ${color || "red"};

    `;
</script>

<meter class={classList} {min} {max} {low} {high} {optimum} {value} {style} />

<style lang="postcss">
    meter::-webkit-meter-optimum-value {
        background: var(--optimum-value-color);
    }
    meter::-webkit-meter-optimum-value,
    meter::-webkit-meter-suboptimum-value,
    meter::-webkit-meter-even-less-good-value {
        transition: 1s width;
    }
</style>
