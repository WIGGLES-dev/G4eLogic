/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugins/foundry/init.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/comlink/dist/esm/comlink.mjs":
/*!***************************************************!*\
  !*** ./node_modules/comlink/dist/esm/comlink.mjs ***!
  \***************************************************/
/*! exports provided: createEndpoint, expose, proxy, proxyMarker, releaseProxy, transfer, transferHandlers, windowEndpoint, wrap */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEndpoint", function() { return createEndpoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "expose", function() { return expose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "proxy", function() { return proxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "proxyMarker", function() { return proxyMarker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "releaseProxy", function() { return releaseProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transfer", function() { return transfer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transferHandlers", function() { return transferHandlers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "windowEndpoint", function() { return windowEndpoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrap", function() { return wrap; });
/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const proxyMarker = Symbol("Comlink.proxy");
const createEndpoint = Symbol("Comlink.endpoint");
const releaseProxy = Symbol("Comlink.releaseProxy");
const throwMarker = Symbol("Comlink.thrown");
const isObject = (val) => (typeof val === "object" && val !== null) || typeof val === "function";
/**
 * Internal transfer handle to handle objects marked to proxy.
 */
const proxyTransferHandler = {
    canHandle: (val) => isObject(val) && val[proxyMarker],
    serialize(obj) {
        const { port1, port2 } = new MessageChannel();
        expose(obj, port1);
        return [port2, [port2]];
    },
    deserialize(port) {
        port.start();
        return wrap(port);
    },
};
/**
 * Internal transfer handler to handle thrown exceptions.
 */
const throwTransferHandler = {
    canHandle: (value) => isObject(value) && throwMarker in value,
    serialize({ value }) {
        let serialized;
        if (value instanceof Error) {
            serialized = {
                isError: true,
                value: {
                    message: value.message,
                    name: value.name,
                    stack: value.stack,
                },
            };
        }
        else {
            serialized = { isError: false, value };
        }
        return [serialized, []];
    },
    deserialize(serialized) {
        if (serialized.isError) {
            throw Object.assign(new Error(serialized.value.message), serialized.value);
        }
        throw serialized.value;
    },
};
/**
 * Allows customizing the serialization of certain values.
 */
const transferHandlers = new Map([
    ["proxy", proxyTransferHandler],
    ["throw", throwTransferHandler],
]);
function expose(obj, ep = self) {
    ep.addEventListener("message", function callback(ev) {
        if (!ev || !ev.data) {
            return;
        }
        const { id, type, path } = Object.assign({ path: [] }, ev.data);
        const argumentList = (ev.data.argumentList || []).map(fromWireValue);
        let returnValue;
        try {
            const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
            const rawValue = path.reduce((obj, prop) => obj[prop], obj);
            switch (type) {
                case 0 /* GET */:
                    {
                        returnValue = rawValue;
                    }
                    break;
                case 1 /* SET */:
                    {
                        parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
                        returnValue = true;
                    }
                    break;
                case 2 /* APPLY */:
                    {
                        returnValue = rawValue.apply(parent, argumentList);
                    }
                    break;
                case 3 /* CONSTRUCT */:
                    {
                        const value = new rawValue(...argumentList);
                        returnValue = proxy(value);
                    }
                    break;
                case 4 /* ENDPOINT */:
                    {
                        const { port1, port2 } = new MessageChannel();
                        expose(obj, port2);
                        returnValue = transfer(port1, [port1]);
                    }
                    break;
                case 5 /* RELEASE */:
                    {
                        returnValue = undefined;
                    }
                    break;
            }
        }
        catch (value) {
            returnValue = { value, [throwMarker]: 0 };
        }
        Promise.resolve(returnValue)
            .catch((value) => {
            return { value, [throwMarker]: 0 };
        })
            .then((returnValue) => {
            const [wireValue, transferables] = toWireValue(returnValue);
            ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
            if (type === 5 /* RELEASE */) {
                // detach and deactive after sending release response above.
                ep.removeEventListener("message", callback);
                closeEndPoint(ep);
            }
        });
    });
    if (ep.start) {
        ep.start();
    }
}
function isMessagePort(endpoint) {
    return endpoint.constructor.name === "MessagePort";
}
function closeEndPoint(endpoint) {
    if (isMessagePort(endpoint))
        endpoint.close();
}
function wrap(ep, target) {
    return createProxy(ep, [], target);
}
function throwIfProxyReleased(isReleased) {
    if (isReleased) {
        throw new Error("Proxy has been released and is not useable");
    }
}
function createProxy(ep, path = [], target = function () { }) {
    let isProxyReleased = false;
    const proxy = new Proxy(target, {
        get(_target, prop) {
            throwIfProxyReleased(isProxyReleased);
            if (prop === releaseProxy) {
                return () => {
                    return requestResponseMessage(ep, {
                        type: 5 /* RELEASE */,
                        path: path.map((p) => p.toString()),
                    }).then(() => {
                        closeEndPoint(ep);
                        isProxyReleased = true;
                    });
                };
            }
            if (prop === "then") {
                if (path.length === 0) {
                    return { then: () => proxy };
                }
                const r = requestResponseMessage(ep, {
                    type: 0 /* GET */,
                    path: path.map((p) => p.toString()),
                }).then(fromWireValue);
                return r.then.bind(r);
            }
            return createProxy(ep, [...path, prop]);
        },
        set(_target, prop, rawValue) {
            throwIfProxyReleased(isProxyReleased);
            // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
            // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
            const [value, transferables] = toWireValue(rawValue);
            return requestResponseMessage(ep, {
                type: 1 /* SET */,
                path: [...path, prop].map((p) => p.toString()),
                value,
            }, transferables).then(fromWireValue);
        },
        apply(_target, _thisArg, rawArgumentList) {
            throwIfProxyReleased(isProxyReleased);
            const last = path[path.length - 1];
            if (last === createEndpoint) {
                return requestResponseMessage(ep, {
                    type: 4 /* ENDPOINT */,
                }).then(fromWireValue);
            }
            // We just pretend that `bind()` didn’t happen.
            if (last === "bind") {
                return createProxy(ep, path.slice(0, -1));
            }
            const [argumentList, transferables] = processArguments(rawArgumentList);
            return requestResponseMessage(ep, {
                type: 2 /* APPLY */,
                path: path.map((p) => p.toString()),
                argumentList,
            }, transferables).then(fromWireValue);
        },
        construct(_target, rawArgumentList) {
            throwIfProxyReleased(isProxyReleased);
            const [argumentList, transferables] = processArguments(rawArgumentList);
            return requestResponseMessage(ep, {
                type: 3 /* CONSTRUCT */,
                path: path.map((p) => p.toString()),
                argumentList,
            }, transferables).then(fromWireValue);
        },
    });
    return proxy;
}
function myFlat(arr) {
    return Array.prototype.concat.apply([], arr);
}
function processArguments(argumentList) {
    const processed = argumentList.map(toWireValue);
    return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
}
const transferCache = new WeakMap();
function transfer(obj, transfers) {
    transferCache.set(obj, transfers);
    return obj;
}
function proxy(obj) {
    return Object.assign(obj, { [proxyMarker]: true });
}
function windowEndpoint(w, context = self, targetOrigin = "*") {
    return {
        postMessage: (msg, transferables) => w.postMessage(msg, targetOrigin, transferables),
        addEventListener: context.addEventListener.bind(context),
        removeEventListener: context.removeEventListener.bind(context),
    };
}
function toWireValue(value) {
    for (const [name, handler] of transferHandlers) {
        if (handler.canHandle(value)) {
            const [serializedValue, transferables] = handler.serialize(value);
            return [
                {
                    type: 3 /* HANDLER */,
                    name,
                    value: serializedValue,
                },
                transferables,
            ];
        }
    }
    return [
        {
            type: 0 /* RAW */,
            value,
        },
        transferCache.get(value) || [],
    ];
}
function fromWireValue(value) {
    switch (value.type) {
        case 3 /* HANDLER */:
            return transferHandlers.get(value.name).deserialize(value.value);
        case 0 /* RAW */:
            return value.value;
    }
}
function requestResponseMessage(ep, msg, transfers) {
    return new Promise((resolve) => {
        const id = generateUUID();
        ep.addEventListener("message", function l(ev) {
            if (!ev.data || !ev.data.id || ev.data.id !== id) {
                return;
            }
            ep.removeEventListener("message", l);
            resolve(ev.data);
        });
        if (ep.start) {
            ep.start();
        }
        ep.postMessage(Object.assign({ id }, msg), transfers);
    });
}
function generateUUID() {
    return new Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
        .join("-");
}


//# sourceMappingURL=comlink.mjs.map


/***/ }),

/***/ "./src/plugins/foundry/classes.ts":
/*!****************************************!*\
  !*** ./src/plugins/foundry/classes.ts ***!
  \****************************************/
/*! exports provided: VActorSheet, VActor, VItemSheet, VApp, VItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VActorSheet", function() { return VActorSheet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VActor", function() { return VActor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VItemSheet", function() { return VItemSheet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VApp", function() { return VApp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VItem", function() { return VItem; });
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @utils/dom */ "./src/utils/dom.ts");

const vSheetDefaultOptions = {
    classes: ["foundry-valor"],
    template: "systems/GURPS/templates/holder.html",
    width: 1330,
    height: 700,
    submitOnChange: false
};
class VActorSheet extends ActorSheet {
    constructor(...args) {
        super(...args);
    }
    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, vSheetDefaultOptions);
    }
    activateListeners(jquery) {
        super.activateListeners(jquery);
        const element = jquery[0];
        const { actor } = this;
        const iframe = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["makeIframe"])({
            origin: game.GURPS.origin,
            slug: `/#/edit/${actor.data.type}/${actor.id}?hideMenu=true`,
        });
        const sheet = element.closest(".foundry-valor");
        const setFrameInactive = e => iframe.style.pointerEvents = "none";
        const setFrameActive = e => iframe.style.pointerEvents = "all";
        sheet.onmousedown = setFrameInactive;
        sheet.onmouseup = setFrameActive;
        element.append(iframe);
    }
    render(force = false, options = {}) {
        if (this.rendered)
            return;
        return super.render(force, options);
    }
}
class VActor extends Actor {
    constructor(...args) {
        super(...args);
    }
    prepareData(...args) {
        var _a, _b, _c, _d, _e, _f;
        super.prepareData(...args);
        const speed = (_b = (_a = this.data.data) === null || _a === void 0 ? void 0 : _a.attributeLevels) === null || _b === void 0 ? void 0 : _b.speed;
        const dexterity = (_d = (_c = this.data.data) === null || _c === void 0 ? void 0 : _c.attributeLevels) === null || _d === void 0 ? void 0 : _d.dexterity;
        const health = (_f = (_e = this.data.data) === null || _e === void 0 ? void 0 : _e.attributeLevels) === null || _f === void 0 ? void 0 : _f.health;
        mergeObject(this.data.data, {
            initiative: speed + (dexterity + health) / 4
        });
    }
}
class VItemSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }
    static get defaultOptions() {
        return mergeObject(ItemSheet.defaultOptions, vSheetDefaultOptions);
    }
    activateListeners(jquery) {
        super.activateListeners(jquery);
        const element = jquery[0];
        const { item } = this;
        const iframe = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_0__["makeIframe"])({
            origin: game.GURPS.origin,
            slug: `/#/edit/${item.data.type}/${item.id}?hideMenu=true`,
        });
        const handle = element.closest(".foundry-valor").querySelector(".window-resizable-handle");
        handle.onmousedown = e => iframe.style.pointerEvents = "none";
        handle.onmouseup = e => iframe.style.pointerEvents = "all";
        iframe.onclick = e => jquery.click();
        element.append(iframe);
    }
    render() {
        if (this.rendered)
            return;
        return super.render(...arguments);
    }
}
class VApp extends Application {
    constructor(...args) {
        super(...args);
    }
    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, vSheetDefaultOptions);
    }
}
class VItem extends Item {
    constructor(...args) {
        super(...args);
    }
}


/***/ }),

/***/ "./src/plugins/foundry/hooks.ts":
/*!**************************************!*\
  !*** ./src/plugins/foundry/hooks.ts ***!
  \**************************************/
/*! exports provided: FoundryHooks, handleValorEvent, hookHandlers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FoundryHooks", function() { return FoundryHooks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleValorEvent", function() { return handleValorEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hookHandlers", function() { return hookHandlers; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var FoundryHooks;
(function (FoundryHooks) {
    FoundryHooks["DeleteActor"] = "deleteActor";
    FoundryHooks["PreCreateActor"] = "preCreateActor";
    FoundryHooks["CreateActor"] = "createActor";
    FoundryHooks["PreUpdateActor"] = "preUpdateActor";
    FoundryHooks["UpdateActor"] = "updateActor";
    FoundryHooks["DeleteItem"] = "deleteItem";
    FoundryHooks["CreateItem"] = "createItem";
    FoundryHooks["UpdateItem"] = "updateItem";
    FoundryHooks["DeleteOwnedItem"] = "deleteOwnedItem";
    FoundryHooks["CreateOwnedItem"] = "createOwnedItem";
    FoundryHooks["UpdateOwnedItem"] = "updateOwnedItem";
    FoundryHooks["RenderActorSheet"] = "renderActorSheet";
    FoundryHooks["RenderItemSheet"] = "renderItemSheet";
})(FoundryHooks || (FoundryHooks = {}));
const settings = {
    types: {
        character: "Actor",
        equipment: "Item",
        skill: "Item",
        trait: "Item"
    }
};
const timestamps = {};
function shouldIgnoreUpdate(id, timestamp) {
    return timestamp <= timestamps[id];
}
function handleValorEvent(changes) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        for (const change of changes.slice(-1)) {
            const { key } = change;
            const isActor = ((_a = game.actors.get(key)) === null || _a === void 0 ? void 0 : _a.id) === key;
            const entity = game[isActor ? "actors" : "items"].get(key);
            console.log(change);
            switch (change.type) {
                case 1: {
                    break;
                }
                case 3: {
                    break;
                }
                case 2: {
                    const timestamp = (_c = (_b = change.obj) === null || _b === void 0 ? void 0 : _b.__meta__) === null || _c === void 0 ? void 0 : _c.lastEdit;
                    timestamps[change.key] = timestamp;
                    const { name, image = "icons/svg/mystery-man.svg" } = change.obj;
                    yield entity.update({
                        name: name || "???",
                        img: image,
                        data: change.obj,
                    }, { diff: false });
                    break;
                }
            }
        }
    });
}
function handleCreateEntity(entity, options, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, data } = entity;
        const obj = Object.assign({}, data.data, {
            type: data.type,
            id
        });
        yield this.add("index", obj, id);
        const sync = yield this.get("index", id);
        yield entity.update({
            data: sync
        });
    });
}
function handleUpdateEntity(entity, d, options, userId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const timestamp = (_b = (_a = d === null || d === void 0 ? void 0 : d.data) === null || _a === void 0 ? void 0 : _a.__meta__) === null || _b === void 0 ? void 0 : _b.lastEdit;
        const { id, data } = entity;
        if (shouldIgnoreUpdate(entity.id, timestamp)) {
        }
        else {
            const obj = Object.assign({}, d === null || d === void 0 ? void 0 : d.data, {
                type: data.type,
            });
            this.update("index", id, obj);
        }
    });
}
const hookHandlers = {
    preCreateActor(data, options, userId) { },
    createActor(actor, options, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handleCreateEntity.call(this, actor, options, userId);
        });
    },
    preUpdateActor(actor, d, options, userId) {
    },
    updateActor(actor, d, options, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handleUpdateEntity.call(this, actor, d, options, userId);
        });
    },
    preDeleteActor(actor, options, userId) { },
    deleteActor(actor, options, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.delete("index", actor.id);
        });
    },
    preCreateItem(data, options, userId) { },
    createItem(item, options, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handleCreateEntity.call(this, item, options, userId);
        });
    },
    preUpdateItem(item, d, options, userId) { },
    updateItem(item, d, options, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handleUpdateEntity.call(this, item, d, options, userId);
        });
    },
    preDeleteItem(item, options, userId) { },
    deleteItem(item, options, userId) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    preCreateOwnedItem() { },
    createOwnedItem() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    preUpdateOwnedItem() { },
    updateOwnedItem() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    preDeleteOwnedItem() { },
    deleteOwnedItem() {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    renderActorSheet(sheet, html, data) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    renderItemSheet(item, html, data) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
};


/***/ }),

/***/ "./src/plugins/foundry/init.ts":
/*!*************************************!*\
  !*** ./src/plugins/foundry/init.ts ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _methods__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./methods */ "./src/plugins/foundry/methods.ts");
/* harmony import */ var comlink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! comlink */ "./node_modules/comlink/dist/esm/comlink.mjs");
/* harmony import */ var _classes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes */ "./src/plugins/foundry/classes.ts");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hooks */ "./src/plugins/foundry/hooks.ts");
/* harmony import */ var _sync__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sync */ "./src/plugins/foundry/sync.ts");
/* harmony import */ var _app_utils_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @app/utils/dom */ "./src/utils/dom.ts");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles.css */ "./src/plugins/foundry/styles.css");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







function connect(src) {
    return __awaiter(this, void 0, void 0, function* () {
        const iframe = Object(_app_utils_dom__WEBPACK_IMPORTED_MODULE_5__["makeIframe"])({
            src,
            style: {
                display: "none",
            },
            appendTo: document.body
        });
        document.body.appendChild(iframe);
        yield new Promise(resolve => iframe.onload = resolve);
        const connection = Object(comlink__WEBPACK_IMPORTED_MODULE_1__["wrap"])(Object(comlink__WEBPACK_IMPORTED_MODULE_1__["windowEndpoint"])(iframe.contentWindow));
        return {
            iframe,
            connection
        };
    });
}
function augment() {
    return __awaiter(this, void 0, void 0, function* () {
        const dragHandler = SidebarDirectory.prototype["_onDragStart"];
        SidebarDirectory.prototype["_onDragStart"] = function (event) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                dragHandler.call(this, event);
                const { id, type } = JSON.parse(event.dataTransfer.getData("text/plain"));
                const entity = yield fromUuid(`${type}.${id}`);
                const data = Object.assign({}, (_a = entity === null || entity === void 0 ? void 0 : entity.data) === null || _a === void 0 ? void 0 : _a.data, { id: randomID(), type });
                event.dataTransfer.setData("application/json", JSON.stringify(data));
            });
        };
    });
}
function onFoundryInit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield augment();
        game.GURPS = {
            origin: "https://valor-59b11.web.app"
        };
        CONFIG.Combat.initiative = {
            decimals: 2,
            formula: "@initiative"
        };
        CONFIG.Actor.entityClass = _classes__WEBPACK_IMPORTED_MODULE_2__["VActor"];
        CONFIG.Item.entityClass = _classes__WEBPACK_IMPORTED_MODULE_2__["VItem"];
        Actors.unregisterSheet("core", ActorSheet);
        Items.unregisterSheet("core", ItemSheet);
        Actors.registerSheet("GURPS", _classes__WEBPACK_IMPORTED_MODULE_2__["VActorSheet"], { makeDefault: true });
        Items.registerSheet("GURPS", _classes__WEBPACK_IMPORTED_MODULE_2__["VItemSheet"], { makeDefault: true });
    });
}
function onFoundryReady() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function handleRoll(e) {
    return __awaiter(this, void 0, void 0, function* () {
        const { event, data } = e;
        const roll = Roll.create(...data);
        const message = yield roll.toMessage();
    });
}
function syncWithValor() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { connection, iframe } = yield connect((_a = game === null || game === void 0 ? void 0 : game.GURPS) === null || _a === void 0 ? void 0 : _a.origin);
        for (const hook of Object.values(_hooks__WEBPACK_IMPORTED_MODULE_3__["FoundryHooks"])) {
            Hooks.on(hook, _hooks__WEBPACK_IMPORTED_MODULE_3__["hookHandlers"][hook].bind(connection));
        }
        yield _sync__WEBPACK_IMPORTED_MODULE_4__["sync"].call(connection);
        yield connection.on("dbchanges", Object(comlink__WEBPACK_IMPORTED_MODULE_1__["proxy"])(_hooks__WEBPACK_IMPORTED_MODULE_3__["handleValorEvent"]));
        yield connection.on("roll", Object(comlink__WEBPACK_IMPORTED_MODULE_1__["proxy"])(handleRoll));
    });
}
try {
    if (window && window["Hooks"]) {
        Hooks.on("init", onFoundryInit);
        Hooks.on("ready", onFoundryReady);
        Hooks.on("ready", syncWithValor);
        if (window.parent !== window) {
            Object(comlink__WEBPACK_IMPORTED_MODULE_1__["expose"])(_methods__WEBPACK_IMPORTED_MODULE_0__["foundryMethods"], Object(comlink__WEBPACK_IMPORTED_MODULE_1__["windowEndpoint"])(window.parent));
        }
    }
}
catch (err) {
}


/***/ }),

/***/ "./src/plugins/foundry/methods.ts":
/*!****************************************!*\
  !*** ./src/plugins/foundry/methods.ts ***!
  \****************************************/
/*! exports provided: foundryMethods */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "foundryMethods", function() { return foundryMethods; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const foundryMethods = {
    createItem(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield Item.create(data, options);
                return item.data;
            }
            catch (err) {
            }
        });
    },
    updateItem(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield Item.update(data, options);
                return item.data;
            }
            catch (err) {
            }
        });
    },
    deleteItem(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield Item.delete(data, options);
                return item.data;
            }
            catch (err) {
            }
        });
    },
    createActor(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actor = yield Actor.delete(data, options);
                return actor.data;
            }
            catch (err) {
            }
        });
    },
    updateActor(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actor = yield Actor.update(data, options);
                return actor.data;
            }
            catch (err) {
            }
        });
    },
    deleteActor(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actor = yield Actor.delete(data, options);
                return actor.data;
            }
            catch (err) {
            }
        });
    },
    createOwnedItem(actorId, item, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownedItem = yield ((_a = game.actors.get(actorId)) === null || _a === void 0 ? void 0 : _a.createOwnedItem(item, options));
                return ownedItem.data;
            }
            catch (err) { }
        });
    },
    updateOwnedItem(actorId, item, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownedItem = yield ((_a = game.actors.get(actorId)) === null || _a === void 0 ? void 0 : _a.updateOwnedItem(item, options));
                return ownedItem.data;
            }
            catch (err) {
            }
        });
    },
    deleteOwnedItem(actorId, itemId, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownedItem = yield ((_a = game.actors.get(actorId)) === null || _a === void 0 ? void 0 : _a.deleteOwnedItem(itemId, options));
                return ownedItem.data;
            }
            catch (err) { }
        });
    },
    getGameData() {
        return duplicate(game);
    },
    getActorData(actorId) {
        return game.actors.get(actorId);
    },
    getItemData(itemId) {
        var _a;
        return (_a = game.items.get(itemId)) === null || _a === void 0 ? void 0 : _a.data;
    },
    getOwnedItemData(actorId, itemId) {
        var _a, _b;
        return (_b = (_a = game.actors.get(actorId)) === null || _a === void 0 ? void 0 : _a.getOwnedItem(itemId)) === null || _b === void 0 ? void 0 : _b.data;
    },
    notify() { },
    roll(formula, data) {
        Roll.create(formula, data).toMessage();
    },
    openPDF(code, options) {
        const api = ui.PDFoundry;
        if (!api)
            return;
        try {
            api.openPDFByCode(code, options);
        }
        catch (err) {
            console.log(err);
        }
    }
};


/***/ }),

/***/ "./src/plugins/foundry/styles.css":
/*!****************************************!*\
  !*** ./src/plugins/foundry/styles.css ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/plugins/foundry/sync.ts":
/*!*************************************!*\
  !*** ./src/plugins/foundry/sync.ts ***!
  \*************************************/
/*! exports provided: sync */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sync", function() { return sync; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function sync() {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const table = yield this.getTable("index");
            const hash = table.reduce((hash, entry) => Object.assign(hash, { [entry.id]: entry }), {});
            const actors = [...game.actors];
            const items = [...game.items];
            const ownedActors = actors.filter(actor => actor.permission === 3);
            const ownedItems = items.filter(item => item.permission === 3);
            for (const entity of [...ownedActors, ...ownedItems]) {
                const entry = hash[entity.id];
                const entryTimestamp = (_b = (_a = entry === null || entry === void 0 ? void 0 : entry.__meta__) === null || _a === void 0 ? void 0 : _a.lastEdit) !== null && _b !== void 0 ? _b : Number.POSITIVE_INFINITY;
                if ((entry === null || entry === void 0 ? void 0 : entry.id) === (entity === null || entity === void 0 ? void 0 : entity.id)) {
                    const entityTimestamp = (_f = (_e = (_d = (_c = entity === null || entity === void 0 ? void 0 : entity.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.__meta__) === null || _e === void 0 ? void 0 : _e.lastEdit) !== null && _f !== void 0 ? _f : Number.NEGATIVE_INFINITY;
                    if (entryTimestamp > entityTimestamp) {
                        entity.update({
                            data: entry
                        });
                    }
                    else {
                        const data = Object.assign({}, entity.data.data, {
                            type: entity.data.type,
                            id: entity.id
                        });
                        this.update("index", entity.id, data);
                    }
                }
                else {
                    const data = Object.assign({}, entity.data.data, {
                        type: entity.data.type,
                        id: entity.id
                    });
                    this.add("index", data, entity.id);
                }
            }
        }
        catch (err) {
            setTimeout(sync.bind(this), 1000);
        }
    });
}


/***/ }),

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/*! exports provided: upload, download, inIframe, makeIframe, bubble, getRoot, VirtualElement, handleEvent, initiateEvent, initProxyEventDispatcher, dispatchEventToIframe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "upload", function() { return upload; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "download", function() { return download; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inIframe", function() { return inIframe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeIframe", function() { return makeIframe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bubble", function() { return bubble; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRoot", function() { return getRoot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VirtualElement", function() { return VirtualElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleEvent", function() { return handleEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initiateEvent", function() { return initiateEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initProxyEventDispatcher", function() { return initProxyEventDispatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dispatchEventToIframe", function() { return dispatchEventToIframe; });
/* harmony import */ var comlink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! comlink */ "./node_modules/comlink/dist/esm/comlink.mjs");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function upload() {
    return new Promise((resolve, reject) => {
        Object.assign(document.createElement("input"), {
            type: "file",
            onchange() {
                return __awaiter(this, void 0, void 0, function* () {
                    resolve(this.files);
                });
            }
        }).click();
    });
}
function download(href, filename) {
    Object.assign(document.createElement("a"), {
        href,
        filename
    }).click();
}
function inIframe() {
    return window && window.parent !== window;
}
function makeIframe({ origin = window.origin, slug = "", src = origin + slug, style = {
    width: "100%",
    height: "100%",
    border: "none"
}, appendTo = null }) {
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, style);
    iframe.src = src;
    if (appendTo instanceof HTMLElement) {
        appendTo.append(iframe);
    }
    return iframe;
}
function bubble(frame) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!frame.contentDocument)
            yield new Promise(resolve => frame.onload = resolve);
        console.log(frame, frame.contentDocument);
        const target = frame === null || frame === void 0 ? void 0 : frame.contentDocument;
        target.onmousemove = (e) => {
            const bounding = frame.getBoundingClientRect();
            const event = new MouseEvent("mousemove", Object.assign(Object.assign({}, e), { screenX: e.screenX + bounding.left, clientX: e.clientX + bounding.left, screenY: e.clientY + bounding.top, clientY: e.clientY + bounding.top }));
            window.dispatchEvent(event);
        };
        target.onclick = (e) => {
            const bounding = frame.getBoundingClientRect();
            const event = new MouseEvent("click", Object.assign(Object.assign({}, e), { screenX: e.screenX + bounding.left, clientX: e.clientX + bounding.left, screenY: e.clientY + bounding.top, clientY: e.clientY + bounding.top }));
            console.log("CLICK");
            window.dispatchEvent(event);
        };
        target.onkeypress = (e) => {
            const event = new MouseEvent("keypress", Object.assign({}, e));
            window.dispatchEvent(event);
        };
        target.onmouseup = (e) => {
            const bounding = frame.getBoundingClientRect();
            const event = new MouseEvent("mouseup", Object.assign(Object.assign({}, e), { screenX: e.screenX + bounding.left, clientX: e.clientX + bounding.left, screenY: e.clientY + bounding.top, clientY: e.clientY + bounding.top }));
            window.dispatchEvent(event);
        };
        target.onmousedown = (e) => {
            const bounding = frame.getBoundingClientRect();
            const event = new MouseEvent("mousedown", Object.assign(Object.assign({}, e), { screenX: e.screenX + bounding.left, clientX: e.clientX + bounding.left, screenY: e.clientY + bounding.top, clientY: e.clientY + bounding.top }));
            frame.parentElement.dispatchEvent(event);
        };
        target.onscroll = (e) => {
            frame.ownerDocument.body.scrollTop = frame.ownerDocument.body.scrollHeight;
        };
    });
}
function getRoot(element) {
    const rootNode = element.getRootNode();
    if (rootNode instanceof Document || rootNode.nodeName === "#document") {
        return rootNode.body;
    }
    else if (rootNode instanceof ShadowRoot) {
        return rootNode.appendChild(document.createElement("div"));
    }
    else {
        return document.body;
    }
}
class VirtualElement {
    constructor(element) {
        Object.defineProperty(this, "element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (element instanceof MouseEvent) {
            const { clientX, clientY } = element;
            this.element = this.generateGetBoundingClientRect(clientX, clientY);
        }
        else {
            const bb = element instanceof HTMLElement ? element.getBoundingClientRect() : element;
            this.element = Object.assign(this.generateGetBoundingClientRect(), bb);
        }
    }
    getBoundingClientRect() {
        return this.element;
    }
    generateGetBoundingClientRect(x = 0, y = 0) {
        return {
            width: 0,
            height: 0,
            top: y,
            right: x,
            bottom: y,
            left: x,
        };
    }
    update(x, y) {
        this.element = this.generateGetBoundingClientRect(x, y);
        return this;
    }
}
function handleEvent(options) {
    function doChange(value, cast) {
        const { target, coerce } = options;
        if (target) {
            const toSend = coerce || cast ? (coerce || cast)(value) : value;
            if (typeof target.next === "function") {
                target.next(toSend);
            }
            else if (typeof target.set === "function") {
                target.set(toSend);
            }
        }
    }
    return function (e) {
        const target = e.target;
        if (target instanceof HTMLElement) {
            if (target instanceof HTMLInputElement) {
                if (target.type === "number") {
                    doChange(target.value, Number);
                }
                else if (target.type === "checkbox") {
                    doChange(target.value, Boolean);
                }
                else if (target.type === "text") {
                    doChange(target.value, String);
                }
            }
            else if (target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
                doChange(target.value, String);
            }
            else if (target.isContentEditable) {
                doChange(target.innerHTML);
            }
        }
    };
}
function initiateEvent(event, data, coordinates) {
    new Event(event, data);
}
function initProxyEventDispatcher() {
    try {
        if (window.parent === window) {
            Object(comlink__WEBPACK_IMPORTED_MODULE_0__["expose"])(initiateEvent, Object(comlink__WEBPACK_IMPORTED_MODULE_0__["windowEndpoint"])(window.parent));
        }
    }
    catch (err) {
    }
}
function dispatchEventToIframe(iframe) {
}


/***/ })

/******/ });
//# sourceMappingURL=foundry-valor.js.map