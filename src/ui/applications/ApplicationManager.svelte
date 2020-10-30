<script context="module">
  export function registerApplication() {}

  import { writable } from "svelte/store";

  export const APPS = writable(new Set());
</script>

<script>
  import { tick } from "svelte";

  import Modal from "./Modal";

  function cleanup(modal) {
    APPS.update((store) => {
      modal.onClose();
      store.delete(modal);
      return store;
    });
  }

  function handleModalFocus(i) {
    let modal = [...$APPS][i];
    focusedModal = modal;
    setModalIndex(i);
  }

  function setModalIndex(i) {
    let zIndex = indexes.reduce((prev, cur) => {
      return cur > prev ? cur : prev;
    }, 0);

    indexes[i] = zIndex + 1;
    indexes = indexes;
  }

  export let focusedModal = null;
  export const apps = [];
  $: indexes = [];

  export function render(title, component, props, { onClose = () => {} } = {}) {
    const modal = { title, component, props, onClose };

    APPS.update((store) => {
      store.add(modal);
      return store;
    });

    tick().then(() => setModalIndex(indexes.length - 1));

    focusedModal = modal;
  }
</script>

<style>
</style>

{#each [...$APPS] as modal, i (i)}
  <Modal
    rendered={true}
    bind:zIndex={indexes[i]}
    title={modal.title}
    bind:this={apps[i]}
    on:focus={() => handleModalFocus(i)}
    on:close={() => cleanup(modal)}
    component={modal.component}
    props={modal.props} />
{/each}
