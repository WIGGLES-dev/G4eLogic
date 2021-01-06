<script lang='ts'>
    export let span: number
    export let width: string;
    let classList: string
    export { classList as class }
    $: style = `
        width: ${width};
    `
</script>

<style>

</style>

<th {span} {style} class='{classList}'>
    <slot>
        
    </slot>
</th>