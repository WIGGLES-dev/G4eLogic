<script>
  export let entity = null;
  $: modifiers = [...entity.modifiers];
  function addModifier() {
    entity.addModifier();
  }
</script>

<style>
</style>
