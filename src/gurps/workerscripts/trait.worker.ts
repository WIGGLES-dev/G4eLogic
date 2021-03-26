import { expose } from "comlink";
import { Trait } from "../resources/trait";
self["onconnect"] = e => expose(Trait, e.ports[0])