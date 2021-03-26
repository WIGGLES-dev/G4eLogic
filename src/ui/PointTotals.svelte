<script lang="ts">
  import { Observable } from "rxjs";
  import { Remote, proxy, releaseProxy } from "comlink";
  import {
    Character as CharacterWorker,
    Attribute,
  } from "@app/gurps/resources/character";
  import { getContext } from "svelte";
  import { mergeMap, startWith } from "rxjs/operators";
  const character = getContext<any>("sheet");
  const character$ = getContext<Observable<Remote<CharacterWorker>>>("worker");
  const pointTotal$ = character$.pipe(mergeMap((c) => c.getPointTotal()));
  $: ({
    unspent,
    spent,
    racialPoints,
    advantages,
    disadvantages,
    attributePoints,
    perks,
    quirks,
    skills,
    techniques,
    spells,
  } = $pointTotal$ || ({} as any));
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
        bind:value={$character.pointTotal}
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
