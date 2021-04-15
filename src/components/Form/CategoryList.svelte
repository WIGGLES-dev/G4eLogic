<script lang="ts">
    export let categories = [];
    let classList = "";
    export { classList as class };
    function handleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        categories = value.split(",").map((s) => s.trim());
    }
    $: value = categories?.join(", ") ?? "";
</script>

<label class={classList}>
    <span>
        <slot>Categories</slot>
    </span>
    <input
        on:change={handleChange}
        type="text"
        placeholder="categories"
        {value}
    />
</label>
