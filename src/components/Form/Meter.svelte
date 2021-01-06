<script lang='ts'>
    export let min: number
    export let max: number
    export let low: number
    export let high: number
    export let optimum: number
    export let value: number
    export let color: string = 'red';
    export let width: string = '100%';
    $: style = `
        width: ${width};
        --optimum-value-color: ${color || 'red'};
    `
</script>

<style>
    meter::-webkit-meter-optimum-value {
        background: var(--optimum-value-color);
    }
    meter::-webkit-meter-optimum-value, meter::-webkit-meter-suboptimum-value, meter::-webkit-meter-even-less-good-value {
        transition: 1s width;
    }
</style>

<meter class="transition-all duration-300" {min} {max} {low} {high} {optimum} value={value||0} {style}></meter>