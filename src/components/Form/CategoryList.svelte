<script>
    export let categories = [];
</script>

<label>
    <span>Categories</span>
    <input
        on:change={(e) => (categories = e.target.value ? e.target.value.split(',') : [])}
        type="text"
        placeholder="categories"
        value={categories.join(',')} />
</label>