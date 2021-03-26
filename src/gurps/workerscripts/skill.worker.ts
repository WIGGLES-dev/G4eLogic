import { expose } from "comlink";
import { Skill } from "../resources/skill";
self["onconnect"] = e => expose(Skill, e.ports[0])