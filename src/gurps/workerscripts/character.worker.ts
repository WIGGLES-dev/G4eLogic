import { expose } from "comlink";
import { Character } from "../resources/character";
self["onconnect"] = e => expose(Character, e.ports[0])