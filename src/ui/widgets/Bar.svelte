<script>
  export let max = 10;
  export let min = 0;
  export let current = 0;
  export let color = "red";

  $: percentage = Math.max(current / max, 0) * 100;
  $: viewWidth = Math.min(Math.max(2.5, percentage), 100);
</script>

<style>
</style>

<div
  class="h-full point-events-none rounded-r-md transition-all duration-300"
  style="background-color: {viewWidth ? color : null}; width:{viewWidth}%" />
