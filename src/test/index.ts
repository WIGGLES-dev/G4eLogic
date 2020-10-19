import { Character } from "@character/character";
import { GCSJSON } from "@externals/gcs_json";

import { CharacterEditor } from "editor/editor";

import "@ui/styles/styles.css";

function init() {
    Character.registerSerializer(GCSJSON);
    CharacterEditor.mount(document.body);
}

document.addEventListener("DOMContentLoaded", init);