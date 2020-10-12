<script>
  export let max = 10;
  export let min = 0;
  export let current = 0;
  export let color = "red";

  $: percentage = () => {
    let percentage = Math.max(current / max, 0) * 100;
    return Math.min(percentage, 100);
  };
</script>

<style>
</style>

<div
  class="h-full point-events-none rounded-r-md transition-all duration-300"
  style="background-color: {color}; width:{percentage()}%" />
