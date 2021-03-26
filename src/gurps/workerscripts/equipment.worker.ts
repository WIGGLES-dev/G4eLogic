import { expose } from "comlink";
import { Equipment } from "../resources/equipment";
self["onconnect"] = e => expose(Equipment, e.ports[0])