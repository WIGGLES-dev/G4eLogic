<script>
  import { getContext } from "svelte";
  
  const { character } = getContext("editor");

  $: totals = $character.pointTotals();
</script>

<style>
  section {
    height: min-content;
  }
  hr {
    @apply border border-solid border-gray-700 m-2 ml-0 mr-0;
  }
  .grid {
    grid-template-columns: auto auto;
  }
</style>

<section class="text-center">
  <div class="grid">
    <div class="col-span-2">
      <div class="text-center bg-gray-700 text-white">
        Point Total [{totals.unspent}]
      </div>
      <div class="pt-2" />
      <input
        class="text-center bg-gray-200 p-1 outline-none"
        type="number"
        placeholder="0"
        bind:value={$character.totalPoints} />
    </div>
    <div class="col-span-2 pt-1" />
    <div class="font-semibold text-right">Spent</div>
    <div class="font-semibold">{totals.spent}</div>
    <hr class="col-span-2" />
    <div class="font-semibold text-right">Race</div>
    <div>{totals.racialPoints}</div>
    <div class="font-semibold text-right">Adv.</div>
    <div>{totals.advantages + totals.perks}</div>
    <div class="font-semibold text-right">Attr.</div>
    <div>{totals.attributePoints}</div>
    <div class="font-semibold text-right">Disad.</div>
    <div>{totals.disadvantages}</div>
    <div class="font-semibold text-right">Quirks</div>
    <div>{totals.quirks}</div>
    <div class="font-semibold text-right">Skills</div>
    <div>{totals.skills + totals.techniques}</div>
    <div class="font-semibold text-right">Spells</div>
    <div>{totals.spells}</div>
  </div>
</section>
