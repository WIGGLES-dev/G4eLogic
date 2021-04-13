<script lang="ts">
  import { getContext } from "svelte";
  import { mergeMap, pluck, startWith } from "rxjs/operators";
  import { Character } from "@internal";
  import { getEditorContext } from "@ui/editors/Editor.svelte";
  const { state, processed$ } = getEditorContext<Character>();
  type pd = ReturnType<Character["process"]>;
  $: ({
    unspent = 0,
    spent = 0,
    racialPoints = 0,
    advantages = 0,
    disadvantages = 0,
    attributePoints = 0,
    perks = 0,
    quirks = 0,
    skills = 0,
    techniques = 0,
    spells = 0,
  } = $processed$?.pointTotals ?? ({} as pd["pointTotals"]));
  const pointTotal = state.sub("pointTotal");
</script>

<section class="text-center">
  <div class="grid">
    <div class="col-span-2">
      <div class="text-center bg-gray-700 text-white">
        Point Total [{unspent}]
      </div>
      <div class="pt-2" />
      <input
        class="text-center bg-gray-200 p-1 outline-none"
        type="number"
        placeholder="0"
        bind:value={$pointTotal}
      />
    </div>
    <div class="col-span-2 pt-1" />
    <div class="font-semibold text-right">Spent</div>
    <div class="font-semibold">{spent}</div>
    <hr class="col-span-2" />
    <div class="font-semibold text-right">Race</div>
    <div>{racialPoints}</div>
    <div class="font-semibold text-right">Adv.</div>
    <div>{advantages + perks}</div>
    <div class="font-semibold text-right">Attr.</div>
    <div>{attributePoints}</div>
    <div class="font-semibold text-right">Disad.</div>
    <div>{disadvantages}</div>
    <div class="font-semibold text-right">Quirks</div>
    <div>{quirks}</div>
    <div class="font-semibold text-right">Skills</div>
    <div>{skills + techniques}</div>
    <div class="font-semibold text-right">Spells</div>
    <div>{spells}</div>
    <hr class="col-span-2" />
  </div>
</section>

<style lang="postcss">
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
