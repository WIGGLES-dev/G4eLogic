<script lang="ts">
    import { onMount } from "svelte";
    import { SvelteComponentDev } from "svelte/internal";
    let template: HTMLTemplateElement;
    export let url = "";
    export let target = undefined;
    export let features = undefined;
    export let component: typeof SvelteComponentDev = undefined;
    let _window: Window;
    export function open() {
        if (!_window) return;
        _window = window.open(url, target, features);
    }
    export function close() {
        _window.close();
        _window = null;
    }
    function transplantStyle() {
        let styles = document.querySelectorAll("style");
        let links = document.querySelectorAll("link");
        styles.forEach((style) => _window.document.head.append(style));
        links.forEach((link) => {
            if (link.getAttribute("rel") === "stylesheet") {
                _window.document.head.append(link);
            }
        });
    }
    onMount(() => {
        open();
        transplantStyle();
        const inst = new component({
            target: _window.document.body,
            props: { ...$$props },
        });
        return () => {
            inst.$destroy();
        };
    });
</script>
