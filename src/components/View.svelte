<script>
    export let component;
    export let props;
    export let html;
</script>

<style>

</style>

<slot name='above'></slot>
<div class="flex">
    <slot name="left"></slot>
        <slot name="content">
            { @html html}
        </slot>
    <slot name="right"></slot>
</div>
<slot name="below"></slot>