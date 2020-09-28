<script>
  export let width = 200;
</script>

<style>
  .sidebar {
    position: fixed;
  }
  .content {
  }
</style>

<div class="sidebar" style="width:{width}px;">
  <slot name="sidebar" />
</div>

<div class="content" style="margin-left:{width}px">
  <slot />
</div>
