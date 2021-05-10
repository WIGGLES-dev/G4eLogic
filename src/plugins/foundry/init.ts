import "./styles.css";
import { foundryMethods } from "./methods";
import { expose, wrap, proxy, windowEndpoint, Remote } from "comlink";
import type { AbstractSystem } from "@internal";
import { VActor, VActorSheet, VItem, VItemSheet } from "./classes";
import { hookHandlers, FoundryHooks, handleValorEvent } from "./hooks";
import { sync } from "./sync";
import { makeIframe } from "@app/utils/dom";

async function connect<T extends Record<string, any>>(src) {
  const iframe = makeIframe({
    src,
    style: {
      display: "none",
    },
  });
  document.body.appendChild(iframe);
  await new Promise((resolve) => (iframe.onload = resolve));
  const connection = wrap<T>(windowEndpoint(iframe.contentWindow));
  return {
    iframe,
    connection,
  };
}
async function augment() {
  const dragHandler = SidebarDirectory.prototype["_onDragStart"];
  SidebarDirectory.prototype["_onDragStart"] = async function (event) {
    dragHandler.call(this, event);
    const { id, type } = JSON.parse(event.dataTransfer.getData("text/plain"));
    const entity = await fromUuid(`${type}.${id}`);
    //@ts-ignore
    const data = Object.assign({}, entity?.data["data"], {
      id: randomID(),
      type,
    });
    event.dataTransfer.setData("application/json", JSON.stringify(data));
  };
}
async function onFoundryInit() {
  await augment();
  game.GURPS = {
    //origin: "https://valor-59b11.web.app"
    origin: "192.168.1.12:3000",
  };
  CONFIG.Combat.initiative = {
    decimals: 2,
    formula: "@initiative",
  };
  CONFIG.Actor.entityClass = VActor;
  CONFIG.Item.entityClass = VItem;
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);
  Actors.registerSheet("GURPS", VActorSheet, { makeDefault: true });
  Items.registerSheet("GURPS", VItemSheet, { makeDefault: true });
}
async function onFoundryReady() {}
async function handleRoll(e) {
  const { event, data } = e;
  //@ts-ignore
  const roll = Roll.create(...data);
  const message = await roll.toMessage();
}
async function syncWithValor() {
  const { origin } = game["GURPS"]["origin"] || {};
  const { connection, iframe } = await connect<AbstractSystem>(origin);
  for (const hook of Object.values(FoundryHooks)) {
    Hooks.on(hook, hookHandlers[hook].bind(connection));
  }
  await sync.call(connection);
  await connection.on("dbchanges", proxy(handleValorEvent));
  await connection.on("roll", proxy(handleRoll));
}
try {
  if (window && window["Hooks"]) {
    Hooks.on("init", onFoundryInit);
    Hooks.on("ready", onFoundryReady);
    Hooks.on("ready", syncWithValor);
    if (window.parent !== window) {
      expose(foundryMethods, windowEndpoint(window.parent));
    }
  }
} catch (err) {
  console.error(err);
}
