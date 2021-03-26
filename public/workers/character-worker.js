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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/gurps/workerscripts/character.worker.ts");
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

/***/ "./node_modules/object-mapper/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-mapper/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*

 The MIT License (MIT)
 =====================

 Copyright (c) 2012 Daniel L. VerWeire

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

module.exports = __webpack_require__(/*! ./src/object-mapper */ "./node_modules/object-mapper/src/object-mapper.js");

/***/ }),

/***/ "./node_modules/object-mapper/src/object-mapper.js":
/*!*********************************************************!*\
  !*** ./node_modules/object-mapper/src/object-mapper.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _undefined

/**
 * Map a object to another using the passed map
 * @param src
 * @param [dest]
 * @param [map]
 * @returns {*}
 * @constructor
 */

function ObjectMapper(src, dest, map)
{
  // There are two different constructors - move around properties if needed
  // e.g (ObjectMapper(from,map))
  if (typeof map === 'undefined') {
    map = dest
    dest = _undefined
  }

  // Loop through the map to process individual mapping instructions
  for (const srckey in map) {
    const destkey = map[srckey]
    // Extract the data from the source object or array
    const data = getKeyValue(src, srckey)
    // Build an object with all of these parameters in case custom transform or default functions need them to derive their values
    let context = {src: src, srckey: srckey, destkey: destkey}
    // Set the data into the destination object or array format
    dest = setKeyValue(dest, destkey, data, context)
  }

  return dest
}

// A string of how to navigate through the incoming array is sent.
// This is translated into an array of instructions for the recursive object
function getKeyValue(src, keystr)
{
  // Parse the source key string into an array/object format that is easy to recurse through
  let keys = parse(keystr)
  // Select the data from the source object or array
  let data = select(src, keys)
  // Return the data for further parsing
  return data
}

// With a given source key array, select the corresponding value(s) in the source object/array.
// If the value does not exist, return null
function select(src, keys)
{
  // Get the object key or index that needs to be parsed
  const key = keys.shift()

  // The child entity is an array.  Traverse the array to obtain data
  if (key.ix !== null && typeof key.ix !== 'undefined')
    return select_arr(src, key, keys)

  // The next instruction is an object key.  Try to obtain the data for the given object key
  if (key.name)
    return select_obj(src, key, keys)

  // No data matching the instructions is found - return null
  return null
}

// Loop through the array and select the key from each value in the array.  If nothing comes back, return null
function select_arr(src, key, keys)
{
  let data = []

  // The source is not an array even though we specify array.  Grab the subnode and add to an array.
  if (!Array.isArray(src)) {
    let d = null
    // Try to get the next value in the chain.  If possible, then add to an array
    if (keys.length)
      d = select(src, keys)
    // If we found something, return it as an array
    return (d !== null) ? [ d ] : null
  }

  // Recursively loop through the array and grab the data
  for (var i=0; i<src.length; i++) {
    // Check to see if we are at a 'leaf' (no more keys to parse).  If so, return the data.  If not, recurse
    var d = (keys.length) ? select(src[i], keys.slice()) : src[i]
    // If the data is populated, add it to the array.  Make sure to keep the same array index so that traversing multi-level arrays work
    if (d !== null)
      data[i] = d
  }

  // Return the whole array if a specific index is not defined('') and there is data to return
  if (key.ix == '' && data.length)
    return data

  // Return a specific node in the array if defined
  if (key.ix && typeof negative_array_access(data, key.ix) !== 'undefined')
    return negative_array_access(data, key.ix);

  // If we are not expecting an array, return the first node - kinda hacky
  if (typeof data[0] !== 'undefined' && key.name && data[0][key.name])
    return data[0][key.name]
  
  // Otherwise, return nothing
  return null
}

// Allows negative array indexes to count down from end of array
function negative_array_access(arr, ix)
{
  var pix = parseInt(ix);
  return pix < 0 ? arr[arr.length + pix] : arr[ix];
}

// Traverse the given object for data using the given key array
function select_obj(src, key, keys)
{
  // Make sure that there is data where we are looking
  if (src && key.name) {
    
    // Match all keys in the object
    if (key.name == '*')
      return select_obj_keys(src, keys)

    // The key specifies an object.  However, the data structure is an array.  Grab the first node and continue
    if (Array.isArray(src)) {
      if (src.length && src[0])
        return (keys.length) ? select(src[0][key.name], keys) : src[0][key.name]

      return null
    }

    // The object has the given key
    if (key.name in src) {
      // There is data to be obtained
      var data = (keys.length) ? select(src[key.name], keys) : src[key.name]
      // If there is data return it
      if (data !== null)
        return data
    }
  }
  // Otherwise, return nothing
  return null
}

// Loop through all the keys in the object and select the key from each key in the object.  If nothing comes back, return null
function select_obj_keys(src, keys)
{
  let data = []
  let n=0
  // Recursively loop through the object keys and grab the data
  for (let k in src) {
    // Check to see if we are at a 'leaf' (no more keys to parse).  If so, return the data.  If not, recurse
    var d = (keys.length) ? select(src[k], keys.slice()) : src[k]
    // If the data is populated, add it to the array
    if (d !== null)
      data[n++] = d
  }

  // Return the whole data array if there is data to return
  if (data.length)
    return data

  // Otherwise, return nothing
  return null
}

// The goal of this function is to identify the different ways that this function can be called, and to structure the data uniformly before caling update()
function setKeyValue(dest, keystr, data, context = {})
{
  // Keystr is undefined - call set_data in case there is a default or transformation to deal with
  if (typeof keystr == 'undefined' || keystr == null)
    return set_data(dest, keystr, data, context)

  // Keystr is an array of values.  Loop through each and identify what format the individual values are
  if (Array.isArray(keystr)) {
    for (let i=0; i<keystr.length; i++) {

      // The substring value is in string notation - recurse with the key string
      if (typeof keystr[i] == 'string')
        dest = setKeyValue(dest, keystr[i], data, context)

      // The subtring value is in array notation - recurse with the key from the array
      else if (Array.isArray(keystr[i])) {
        let [k,t,d] = keystr[i]
        if (typeof t !== 'undefined') context.transform = t
        if (typeof d !== 'undefined') context.default = d
        dest = setKeyValue(dest, k, data, context)
      }
      
      // The substring value is in object notation - dig further
      else {
        if (typeof keystr[i].transform !== 'undefined') context.transform = keystr[i].transform
        if (typeof keystr[i].default !== 'undefined') context.default = keystr[i].default
        
        // If the substring value of the key is an array, parse the array.  If this is parsed in a recursion, it is confused with arrays containing multiple values
        if (Array.isArray(keystr[i].key)) {
          let [k,t,d] = keystr[i].key
          if (typeof t !== 'undefined') context.transform = t
          if (typeof d !== 'undefined') context.default = d
          dest = setKeyValue(dest, k, data, context)
        }
        
        // The substring value is regular object notation - recurse with the key of the substring
        else
          dest = setKeyValue(dest, keystr[i].key, data, context)
      }
    }
  }

  // The value is in string notation - ready for update!
  else if (typeof keystr == 'string')
    dest = update(dest, data, parse(keystr), context)

  // The value is in object notation - dig a bit further
  else {
    if (typeof keystr.transform !== 'undefined') context.transform = keystr.transform
    if (typeof keystr.default !== 'undefined') context.default = keystr.default
    // If the value of the key is an array, parse the array.  If this is parsed in a recursion, it is confused with arrays containing multiple values
    if (Array.isArray(keystr.key)) {
      let [k,t,d] = keystr.key
      if (typeof t !== 'undefined') context.transform = t
      if (typeof d !== 'undefined') context.default = d
      dest = setKeyValue(dest, k, data, context)
    }
    // The value is in regular object notation.  Recurse with the object key
    else
      dest = setKeyValue(dest, keystr.key, data, context)
  }

  return dest
}

// if the data is an array, walk down the obj path and build until there is an array key
function update(dest, data, keys, context)
{
  if (keys) {
    // Get the object key and index that needs to be parsed
    const key = keys.shift()

    // If there is a key, we need to traverse down to this part of the object
    if (key.name)
      return update_obj(dest, key, data, keys, context)

    // If there is an array index, we need to traverse through the array
    if (typeof key.ix !== 'undefined') {
      return update_arr(dest, key, data, keys, context)
    }
  }

  // If there is neither an array or index, we need to see if there is data to set
  return set_data(dest, keys, data, context)
}

// Update the destination object.key with the data
function update_obj(dest, key, data, keys, context)
{
  // There are further instructions remaining - we will need to recurse
  if (keys.length) {
    // There is a pre-existing destination object.  Recurse through to the object key
    if (dest !== null && typeof dest !== 'undefined') {
      let o = update(dest[key.name], data, keys, context)
      if (o !== null && typeof o !== 'undefined')
        dest[key.name] = o
    }
    // There is no pre-existing object.  Check to see if data exists before creating a new object
    else {
      // Check to see if there is a value before creating an object to store it
      let o = update(null, data, keys, context)
      if (o !== null) {
        dest = {}
        dest[key.name] = o
      }
    }
  }
  // This is a leaf.  Set data into the dest
  else
    dest = set_data(dest, key, data, context)

  return dest
}

// Update the dest[] array with the data on each index
function update_arr(dest, key, data, keys, context)
{
  // The 'add' instruction is set.  This means to take the data and add it onto a new array node 
  if (key.add) {
    if (data !== null && typeof data !== 'undefined') {
      dest = dest || []
      dest.push(applyTransform(data,dest,context))
      // dest = dest.concat(data)
    }
    return dest
  }

  // Just update a single array node
  if (key.ix !== '') {
    return update_arr_ix(dest, key.ix, applyTransform(data,dest,context), keys, context)
  }

  // If the data is in an array format then make sure that there is a dest index for each data index
  if (Array.isArray(data)) {
    dest = dest || []
    // Loop through each index in the data array and update the destination object with the data
    dest = data.reduce(function(dest,d,i) {
      // If the instruction is to update all array indices ('') or the current index, update the child data element.  Otherwise, don't bother
      if (key.ix == '' || key.ix == i) {
        return update_arr_ix(dest, i, applyTransform(d,dest,context), keys.slice(), context)
      }
    }, dest)

    return dest
  }

  // Set the specific array index with the data
  else 
    return update_arr_ix(dest, '0', data, keys, context)
}

function applyTransform(data, dest, context){
  if (typeof context.transform == 'function') {
    return context.transform(data, context.src, dest, context.srckey, context.destkey)
  }else{
    return data;
  }
}

function update_arr_ix(dest, ix, data, keys, context)
{
  let o
  if (dest !== null && typeof dest !== 'undefined' && typeof dest[ix] !== 'undefined')
    o = (keys.length) ? update(dest[ix], data, keys, context) : data
  else
    o = (keys.length) ? update(null, data, keys, context) : data

  // Only update (and create if needed) dest if there is data to be saved
  if (o !== null) {
    dest = dest || []
    dest[ix] = o
  }

  return dest
}

// Set the given data into the given destination object
function set_data(dest, key, data, context)
{
  // If there is a transformation function, call the function.
  if (typeof context.transform == 'function') {
    dest = dest || {}
    data = context.transform(data, context.src, dest, context.srckey, context.destkey)
  }

  // See if data is null and there is a default
  if (typeof context.default !== 'undefined' && (data == null || typeof data == 'undefined')) {
    // There is a default function, call the function to set the default
    if (typeof context.default == 'function') {
      dest = dest || {}
      data = context.default(context.src, context.srckey, dest, context.destkey)
    }
    // The default is a specific value
    else
      data = context.default
  }

  // Set the object to the data if it is not undefined
  if (typeof data !== 'undefined' && key && key.name) {
    // Set the data if the data is not null, or if the 'allow nulls' key is set, or if there is a default (in the case of default=null, make sure to write this out)
    if (data !== null || key.nulls || (typeof context.default !== 'undefined' && context.default == null)) {
      dest = dest || {}
      dest[key.name] = data
    }
  }

  // Return the dest variable back to the caller.
  return dest
}


// Turns a key string (like key1.key2[].key3 into ['key1','key2','[]','key3']...)
// 
function parse(key_str, delimiter = '.')
{
  // Return null if the key_str is null
  if (key_str == null)
    return null

  // Split the key_array and allowing escapes
  const key_arr = split(key_str, delimiter)
  //const key_arr = key_str.split(delimiter)
  let keys = []
  let n = 0
  for (let i=0; i<key_arr.length; i++) {
    // Build a object which is either an object key or an array
    //  Note that this is not the most readable, but it is fastest way to parse the string (at this point in time)
    let name_begin=-1, name_end=-1, ix_begin=-1, ix_end=-1, o = {}, a = {}, k = key_arr[i]
    for (let j=0; j<k.length; j++) {
      switch (k[j]) {
        case '[' :
          ix_begin = j+1
          name_end = j
          break
        case ']' :
          ix_end = j
          break
        case '+' :
          if (ix_end == j-1) a.add = true
          break
        case '?' :
          name_end = j
          if (ix_end == -1) o.nulls = true
          break
        default :
          if (ix_begin == -1) name_end = j+1
      }
    }
    if (name_end > 0) {
      o.name = k.substring(name_begin, name_end)
      keys[n++] = o
    }
    if (ix_end > 0) {
      a.ix = k.substring(ix_begin, ix_end)
      keys[n++] = a
    }
  }

  return keys
} 

// Perform the same function as split(), but keep track of escaped delimiters
function split(str, delimiter)
{
  let arr = [], n = 0
  , esc = -99
  , s = ''

  for (let i=0; i<str.length; i++) {
    switch(str[i]) {
      case delimiter :
        if (esc !== (i-1)) {
          arr[n++] = s
          s = ''
        } else s += str[i]
        break
      case '\\' :
        // Escaping a backslash
        if (esc == (i-1)) {
          esc = -99
          s += str[i-1] + str[i]
        } else 
          esc = i
        break
      default :
        if (esc == (i-1))
          s += str[i-1]
        s += str[i]
    }
  }
  arr[n++] = s
  return arr
}

module.exports = ObjectMapper
module.exports.merge = ObjectMapper
module.exports.getKeyValue = getKeyValue
module.exports.setKeyValue = setKeyValue
module.exports.parse = parse
module.exports.split = split


/***/ }),

/***/ "./src/entity.ts":
/*!***********************!*\
  !*** ./src/entity.ts ***!
  \***********************/
/*! exports provided: Entity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Entity", function() { return Entity; });
/* harmony import */ var object_mapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! object-mapper */ "./node_modules/object-mapper/index.js");
/* harmony import */ var object_mapper__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(object_mapper__WEBPACK_IMPORTED_MODULE_0__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Entity {
    constructor(value, root) {
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.value = value;
        this.root = root || value;
    }
    get enabled() {
        var _a, _b;
        return (_b = (_a = this === null || this === void 0 ? void 0 : this.value) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.enabled;
    }
    get id() {
        var _a;
        return (_a = this.value) === null || _a === void 0 ? void 0 : _a.id;
    }
    get type() {
        var _a;
        return (_a = this === null || this === void 0 ? void 0 : this.value) === null || _a === void 0 ? void 0 : _a.type;
    }
    getType() {
        console.log("GETTING TYPE");
        return this.type;
    }
    getValue() {
        console.log("GETTING VALUE");
        return this.value;
    }
    static hashEmbedded(root, start = root, maxDepth = Number.POSITIVE_INFINITY) {
        let currentDepth = 0;
        const embeds = {};
        function descend(data) {
            const { children = {} } = data || {};
            for (const [type, data] of Object.entries(children)) {
                for (const child of data) {
                    embeds[child.id] = new Entity(child, root);
                    if (currentDepth++ > maxDepth)
                        descend(child);
                }
            }
        }
        descend(start);
        return embeds;
    }
    getRootEmbeds() {
        return Entity.hashEmbedded(this.root);
    }
    getEmbeds() {
        return Entity.hashEmbedded(this.root, this.value);
    }
    getEmbedded(id) {
        return Entity.hashEmbedded(this.root, this.value)[id];
    }
    getChildren() {
        return Entity.hashEmbedded(this.root, this.value, 1);
    }
    getFeatures() {
        const root = new Entity(this.root);
        const embedded = root.getRootEmbeds();
        const activeEmbeds = Object.values(embedded).filter(entity => !!entity.enabled);
        const features = activeEmbeds.flatMap(entity => entity.value.features).filter(v => !!v);
        return features;
    }
    update(value) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    set(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.update(value);
        });
    }
    subscribe() { }
    unsubscribe() { }
    map(typeMap, nestfunc) {
        const nodes = this.getEmbeds();
        const transformed = {};
        for (const [id, entity] of Object.entries(nodes)) {
            const map = typeMap[entity.type];
            if (!map)
                continue;
            transformed[id] = Object(object_mapper__WEBPACK_IMPORTED_MODULE_0__["merge"])(entity.value, map);
        }
    }
}


/***/ }),

/***/ "./src/gurps/resources/character.ts":
/*!******************************************!*\
  !*** ./src/gurps/resources/character.ts ***!
  \******************************************/
/*! exports provided: Appearance, Character, createAttributeCollection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Appearance", function() { return Appearance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Character", function() { return Character; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createAttributeCollection", function() { return createAttributeCollection; });
/* harmony import */ var _app_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/entity */ "./src/entity.ts");
/* harmony import */ var _app_gurps_resources_characterConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/gurps/resources/characterConfig */ "./src/gurps/resources/characterConfig.ts");
/* harmony import */ var _characterFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./characterFunctions */ "./src/gurps/resources/characterFunctions.ts");
/* harmony import */ var _trait__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./trait */ "./src/gurps/resources/trait.ts");
/* harmony import */ var _equipment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./equipment */ "./src/gurps/resources/equipment.ts");





var Appearance;
(function (Appearance) {
    Appearance[Appearance["Horrific"] = 0] = "Horrific";
    Appearance[Appearance["Monstrous"] = 1] = "Monstrous";
    Appearance[Appearance["Hideous"] = 2] = "Hideous";
    Appearance[Appearance["Unattractive"] = 3] = "Unattractive";
    Appearance[Appearance["Average"] = 4] = "Average";
    Appearance[Appearance["Attractive"] = 5] = "Attractive";
    Appearance[Appearance["Handsome_Beautiful"] = 6] = "Handsome_Beautiful";
    Appearance[Appearance["Very_Handsome_Beautiful"] = 7] = "Very_Handsome_Beautiful";
    Appearance[Appearance["Transcendent"] = 8] = "Transcendent";
})(Appearance || (Appearance = {}));
class Character extends _app_entity__WEBPACK_IMPORTED_MODULE_0__["Entity"] {
    constructor(character) {
        super(character);
    }
    getWeapons() { }
    getRangedWeapons() { }
    getMeleeWeapons() { }
    getCarriedWeight() {
        return Object.values(this.getEmbeds())
            .filter(entity => entity.type === "equipment")
            .map(entity => new _equipment__WEBPACK_IMPORTED_MODULE_4__["Equipment"](entity.value, entity.root))
            .reduce((weight, item) => weight + item.eWeight, 0);
        return 0;
    }
    getEncumbranceLevel() {
        const bl = this.getBasicLift();
        const carried = this.getCarriedWeight();
        if (carried > 10 * bl) {
            return -5;
        }
        else if (carried > 6 * bl) {
            return -4;
        }
        else if (carried > 3 * bl) {
            return -3;
        }
        else if (carried > 2 * bl) {
            return -2;
        }
        else if (carried > bl) {
            return -1;
        }
        else {
            return 0;
        }
    }
    getAttributeCollection() {
        if (!this.root)
            return {};
        return createAttributeCollection(this.root);
    }
    getAttribute(attribute) {
        return this.getAttributeCollection()[attribute];
    }
    getOrderedAttributes() {
        const { config: { ui: { attributeOrder } } } = this.value;
        return attributeOrder;
    }
    getOrderedPools() {
        const { config: { ui: { poolOrder } } } = this.value;
        return poolOrder;
    }
    getHitLocationCollection() {
        return createHitLocationCollection(this.value);
    }
    getSwingDamage() { return _characterFunctions__WEBPACK_IMPORTED_MODULE_2__["Gurps"].getSwingDamage(this.getAttribute("striking strength").level); }
    getThrustDamage() { return _characterFunctions__WEBPACK_IMPORTED_MODULE_2__["Gurps"].getThrustDamage(this.getAttribute("striking strength").level); }
    getBasicLift() { return _characterFunctions__WEBPACK_IMPORTED_MODULE_2__["Gurps"].basicLift(this.getAttribute("lifting strength").level); }
    getPointTotal() {
        const sumSkills = (tot, s) => tot + s.points;
        const embeds = Object.values(this.getEmbeds());
        const total = this.value.pointTotal;
        const attributePoints = Object.values(this.getAttributeCollection()).reduce((points, attribute) => points + (attribute.pointsSpent || 0), 0);
        const skills = embeds.map(entity => entity.value).filter(data => data.type === "skill").reduce(sumSkills, 0);
        const techniques = embeds.map(entity => entity.value).filter(data => data.type === "technique").reduce(sumSkills, 0);
        const spells = embeds.map(entity => entity.value).filter(data => data.type === "spell").reduce(sumSkills, 0);
        const traits = Object(_trait__WEBPACK_IMPORTED_MODULE_3__["split"])(embeds.map(entity => entity.value).filter((data) => data.type === "trait"));
        const racialPoints = Object(_trait__WEBPACK_IMPORTED_MODULE_3__["sumTraitArray"])(traits[_trait__WEBPACK_IMPORTED_MODULE_3__["TraitCategory"].Racial]);
        const advantages = Object(_trait__WEBPACK_IMPORTED_MODULE_3__["sumTraitArray"])(traits[_trait__WEBPACK_IMPORTED_MODULE_3__["TraitCategory"].Advantage]);
        const perks = Object(_trait__WEBPACK_IMPORTED_MODULE_3__["sumTraitArray"])(traits[_trait__WEBPACK_IMPORTED_MODULE_3__["TraitCategory"].Perk]);
        const disadvantages = Object(_trait__WEBPACK_IMPORTED_MODULE_3__["sumTraitArray"])(traits[_trait__WEBPACK_IMPORTED_MODULE_3__["TraitCategory"].Disadavantage]);
        const quirks = Object(_trait__WEBPACK_IMPORTED_MODULE_3__["sumTraitArray"])(traits[_trait__WEBPACK_IMPORTED_MODULE_3__["TraitCategory"].Quirk]);
        const spent = +attributePoints
            + racialPoints
            + advantages
            + perks
            + disadvantages
            + quirks
            + skills
            + techniques
            + spells;
        return {
            attributePoints,
            racialPoints,
            advantages,
            perks,
            disadvantages,
            quirks,
            skills,
            techniques,
            spells,
            spent,
            total,
            unspent: total - spent
        };
    }
}
Object.defineProperty(Character, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "character"
});
Object.defineProperty(Character, "version", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 1
});
function createAttributeCollection(characterData) {
    const character = new Character(characterData);
    const features = character.getFeatures();
    const { attributeLevels, config: { ui: { attributeOrder, poolOrder }, attributes = {} } = {} } = characterData;
    const collection = {};
    for (const [name, data] of Object.entries(attributes)) {
        const { basedOn = "return null", defaultLevel = 0, tags = [], costPerLevel = 0 } = data;
        const { level: baseLevel = defaultLevel, mod = 0, current = 0 } = attributeLevels[name] || {};
        collection[name] = {
            currentValue: current,
            keys: data,
            costPerLevel,
            tags,
            name,
            baseLevel,
            current,
            mod,
            get unmodifiedLevel() {
                return this.level - this.bonus - this.mod - this.base;
            },
            get levelsIncreased() {
                return baseLevel - defaultLevel;
            },
            get pointsSpent() {
                return this.levelsIncreased * costPerLevel;
            },
            get level() {
                return baseLevel + this.bonus + mod + this.base;
            },
            get displayLevel() {
                return this.level;
            },
            get base() {
                const formula = basedOn.startsWith("return") ? new Function("attributes", basedOn) : (attributes) => attributes[basedOn].level;
                try {
                    return formula(collection);
                }
                catch (err) {
                    return 0;
                }
            },
            get bonus() {
                return features
                    .filter(f => f.type === "attribute bonus" && f.attribute === name)
                    .reduce((t, b) => t + b.amount, 0);
            }
        };
    }
    return collection;
}
function createHitLocationCollection(characterData) {
    const character = new Character(characterData);
    const features = character.getFeatures();
    const hitPoints = character.getAttribute("hit points");
    const collection = {};
    const { hitLocationDamage, config: { locations = {} } = {} } = characterData;
    const hitLocations = Object(_app_gurps_resources_characterConfig__WEBPACK_IMPORTED_MODULE_1__["parseHitLocations"])(locations);
    for (const [name, data] of Object.entries(hitLocations)) {
        const { crippleDivisor = false, subLocations } = data;
        const dt = hitLocationDamage[name];
        collection[name] = {
            name,
            keys: data,
            get damageResistance() {
                return features
                    .filter(f => f.type === "armor bonus" && f.location === name)
                    .map(f => f.amount)
                    .reduce((t, b) => t + b, 0);
            },
            get subLocations() {
                return subLocations === null || subLocations === void 0 ? void 0 : subLocations.map(location => collection[location]);
            },
            damageTaken: dt,
            get isCrippled() {
                const ct = this.crippleThreshold;
                if (ct === 0)
                    return false;
                return this.damageTaken > ct;
            },
            get crippleThreshold() {
                return typeof crippleDivisor === "number" ? (hitPoints.level / crippleDivisor) : 0;
            }
        };
    }
    return collection;
}


/***/ }),

/***/ "./src/gurps/resources/characterConfig.ts":
/*!************************************************!*\
  !*** ./src/gurps/resources/characterConfig.ts ***!
  \************************************************/
/*! exports provided: parseHitLocations */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseHitLocations", function() { return parseHitLocations; });
function parseHitLocations(locations) {
    const hitLocations = Object.entries(locations).reduce((locations, [location, data]) => {
        var _a;
        let toCreate = [{
                location,
                subLocations: data.subLocations || []
            }];
        if (data.has instanceof Array) {
            toCreate = (_a = data.has) === null || _a === void 0 ? void 0 : _a.map(specifier => {
                var _a;
                return ({
                    location: `${specifier} ${location}`,
                    subLocations: (_a = data.subLocations) === null || _a === void 0 ? void 0 : _a.map(location => `${specifier} ${location}`)
                });
            });
        }
        const newLocations = toCreate.map(({ location, subLocations }) => {
            return Object.assign({}, data, {
                location,
                subLocations,
                genericLocation: location,
            });
        });
        newLocations.forEach(data => {
            locations[data.location] = data;
        });
        return locations;
    }, {});
    return hitLocations;
}


/***/ }),

/***/ "./src/gurps/resources/characterFunctions.ts":
/*!***************************************************!*\
  !*** ./src/gurps/resources/characterFunctions.ts ***!
  \***************************************************/
/*! exports provided: Gurps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gurps", function() { return Gurps; });
class Gurps {
    static basicLift(liftingStrength) {
        return Math.round(Math.pow(liftingStrength, 2) / 5);
    }
    static encumbranceLevel(basicLift, carriedWeight) {
        if (carriedWeight < basicLift) {
            return 0;
        }
        else if (carriedWeight < basicLift * 2) {
            return -1;
        }
        else if (carriedWeight < basicLift * 3) {
            return -2;
        }
        else if (carriedWeight < basicLift * 6) {
            return -3;
        }
        else if (carriedWeight < basicLift * 10) {
            return -4;
        }
        else {
            return -5;
        }
    }
    static encumberedDodgeTarget(encumbranceLevel, dodgeTarget) {
        switch (encumbranceLevel) {
            case 0:
                return dodgeTarget;
            case -1:
                return Math.floor(dodgeTarget * .8);
            case -2:
                return Math.floor(dodgeTarget * .6);
            case -3:
                return Math.floor(dodgeTarget * .4);
            case -4:
                return Math.floor(dodgeTarget * .2);
        }
    }
    static getThrustDamage(strikingStrength) {
        let value = strikingStrength;
        if (strikingStrength < 19) {
            return Dice.diceString(1, -(6 - (value - 1) / 2));
        }
        value -= 11;
        if (strikingStrength > 50) {
            value--;
            if (strikingStrength > 79) {
                value -= 1 + (strikingStrength - 80) / 5;
            }
        }
        return Dice.diceString(value / 8 + 1, value % 8 / 2 - 1);
    }
    static getSwingDamage(strikingStrength) {
        let value = strikingStrength;
        if (value < 10) {
            return Dice.diceString(1, -(5 - (value - 1) / 2));
        }
        if (value < 28) {
            value -= 9;
            return Dice.diceString(value / 4 + 1, value % 4 - 1);
        }
        if (strikingStrength > 40) {
            value -= (strikingStrength - 40) / 5;
        }
        if (strikingStrength > 59) {
            value++;
        }
        value += 9;
        return Dice.diceString(value / 8 + 1, value % 8 / 2 - 1);
    }
}
class Dice {
    static diceString(count, modifier = 0, sides = 6, multiplier = 1) {
        let string = "";
        count = Math.floor(Math.max(count, 0));
        sides = Math.max(sides, 0);
        modifier = Math.floor(modifier);
        if (count > 0 && sides > 0) {
            string += count;
            string += "d";
            string += sides;
        }
        if (modifier > 0) {
            string += "+";
            string += modifier;
        }
        else if (modifier < 0) {
            string += modifier;
        }
        if (multiplier !== 1) {
            string += "*";
            string += multiplier;
        }
        if (string.length === 0) {
            string += 0;
        }
        return string;
    }
}


/***/ }),

/***/ "./src/gurps/resources/equipment.ts":
/*!******************************************!*\
  !*** ./src/gurps/resources/equipment.ts ***!
  \******************************************/
/*! exports provided: Equipment, EquipmentModifierWeightType, EquipmentModifierWeightValueType, EquipmentModifierValueType, EquipmentModifierCostValueType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Equipment", function() { return Equipment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EquipmentModifierWeightType", function() { return EquipmentModifierWeightType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EquipmentModifierWeightValueType", function() { return EquipmentModifierWeightValueType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EquipmentModifierValueType", function() { return EquipmentModifierValueType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EquipmentModifierCostValueType", function() { return EquipmentModifierCostValueType; });
/* harmony import */ var _app_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/entity */ "./src/entity.ts");

class Equipment extends _app_entity__WEBPACK_IMPORTED_MODULE_0__["Entity"] {
    constructor(value, root) {
        super(value, root);
    }
    get equipped() {
        return this.enabled;
    }
    get quantity() {
        return this.value.quantity;
    }
    get _value() {
        return this.value.value;
    }
    get weight() {
        return this.value.weight;
    }
    get eValue() {
        return this.quantity * this._value;
    }
    get eWeight() {
        return this.quantity * this.weight;
    }
    get containedValue() {
        const children = Object.values(this.getEmbeds()).filter(e => e.type === "equipment").map(e => new Equipment(e.value, this.root));
        return children.reduce((weight, item) => weight + item.containedValue, 0) + this.eValue;
    }
    getContainedValue() { return this.containedValue; }
    get containedWeight() {
        const children = Object.values(this.getEmbeds()).filter(e => e.type === "equipment").map(e => new Equipment(e.value, this.root));
        return children.reduce((weight, item) => weight + item.containedWeight, 0) + this.eWeight;
    }
    getContainedWeight() { return this.containedWeight; }
}
Object.defineProperty(Equipment, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "equipment"
});
Object.defineProperty(Equipment, "version", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 1
});
var EquipmentModifierWeightType;
(function (EquipmentModifierWeightType) {
    EquipmentModifierWeightType["originalWeight"] = "to_original_weight";
    EquipmentModifierWeightType["baseWeight"] = "to_base_weight";
    EquipmentModifierWeightType["finalBaseWeight"] = "to_final_base_weight";
    EquipmentModifierWeightType["finalWeight"] = "to_final_weight";
})(EquipmentModifierWeightType || (EquipmentModifierWeightType = {}));
var EquipmentModifierWeightValueType;
(function (EquipmentModifierWeightValueType) {
    EquipmentModifierWeightValueType["addition"] = "+";
    EquipmentModifierWeightValueType["percentageAdder"] = "%";
    EquipmentModifierWeightValueType[EquipmentModifierWeightValueType["percentageMultiplier"] = 1] = "percentageMultiplier";
    EquipmentModifierWeightValueType[EquipmentModifierWeightValueType["multiplier"] = 0] = "multiplier";
})(EquipmentModifierWeightValueType || (EquipmentModifierWeightValueType = {}));
var EquipmentModifierValueType;
(function (EquipmentModifierValueType) {
    EquipmentModifierValueType["originalCost"] = "to_original_cost";
    EquipmentModifierValueType["baseCost"] = "to_base_cost";
    EquipmentModifierValueType["finalBaseCost"] = "to_final_base_cost";
    EquipmentModifierValueType["finalCost"] = "to_final_cost";
})(EquipmentModifierValueType || (EquipmentModifierValueType = {}));
var EquipmentModifierCostValueType;
(function (EquipmentModifierCostValueType) {
    EquipmentModifierCostValueType["addition"] = "+";
    EquipmentModifierCostValueType["percentage"] = "%";
    EquipmentModifierCostValueType["multiplier"] = "x";
    EquipmentModifierCostValueType["cf"] = "cf";
})(EquipmentModifierCostValueType || (EquipmentModifierCostValueType = {}));


/***/ }),

/***/ "./src/gurps/resources/trait.ts":
/*!**************************************!*\
  !*** ./src/gurps/resources/trait.ts ***!
  \**************************************/
/*! exports provided: ControlRating, TraitModifierType, TraitModifierAffects, TraitType, Trait, calculateTraitCost, costModifier, modifyPoints, calculateModifierPoints, applyRounding, TraitCategory, isAdvantage, isPerk, isDisadvantage, isQuirk, isFeature, getCategory, getContainerType, getTraitType, split, sumTraitArray, removeDuplicates */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ControlRating", function() { return ControlRating; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraitModifierType", function() { return TraitModifierType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraitModifierAffects", function() { return TraitModifierAffects; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraitType", function() { return TraitType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Trait", function() { return Trait; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateTraitCost", function() { return calculateTraitCost; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "costModifier", function() { return costModifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "modifyPoints", function() { return modifyPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateModifierPoints", function() { return calculateModifierPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyRounding", function() { return applyRounding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraitCategory", function() { return TraitCategory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAdvantage", function() { return isAdvantage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPerk", function() { return isPerk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDisadvantage", function() { return isDisadvantage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isQuirk", function() { return isQuirk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFeature", function() { return isFeature; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCategory", function() { return getCategory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getContainerType", function() { return getContainerType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTraitType", function() { return getTraitType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "split", function() { return split; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sumTraitArray", function() { return sumTraitArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeDuplicates", function() { return removeDuplicates; });
/* harmony import */ var _app_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/entity */ "./src/entity.ts");

var ControlRating;
(function (ControlRating) {
    ControlRating["CannotResist"] = "none";
    ControlRating[ControlRating["ResistRarely"] = 6] = "ResistRarely";
    ControlRating[ControlRating["ResistFairlyOften"] = 9] = "ResistFairlyOften";
    ControlRating[ControlRating["ResistQuiteOften"] = 12] = "ResistQuiteOften";
    ControlRating[ControlRating["ResistAlmostAlway"] = 15] = "ResistAlmostAlway";
    ControlRating["NoneRequired"] = "n/a";
})(ControlRating || (ControlRating = {}));
var TraitModifierType;
(function (TraitModifierType) {
    TraitModifierType["Percentage"] = "percentage";
    TraitModifierType["Points"] = "points";
    TraitModifierType["Multiplier"] = "multiplier";
})(TraitModifierType || (TraitModifierType = {}));
var TraitModifierAffects;
(function (TraitModifierAffects) {
    TraitModifierAffects["Base"] = "base only";
    TraitModifierAffects["Levels"] = "levels only";
    TraitModifierAffects["Total"] = "total";
})(TraitModifierAffects || (TraitModifierAffects = {}));
var TraitType;
(function (TraitType) {
    TraitType["Mental"] = "Mental";
    TraitType["Physical"] = "Physical";
    TraitType["Social"] = "Social";
    TraitType["Exotic"] = "Exotic";
})(TraitType || (TraitType = {}));
class Trait extends _app_entity__WEBPACK_IMPORTED_MODULE_0__["Entity"] {
    constructor(value, root) {
        super(value, root);
    }
    getAdjustedPoints() {
        return calculateTraitCost(this.value);
    }
    getTraitType() {
        return getTraitType(this.value);
    }
}
Object.defineProperty(Trait, "version", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 1
});
Object.defineProperty(Trait, "type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "trait"
});
function calculateTraitCost({ basePoints, hasLevels, levels, hasHalfLevel, roundDown, controlRating, pointsPerLevel, modifiers }) {
    let baseEnh = 0;
    let levelEnh = 0;
    let baseLim = 0;
    let levelLim = 0;
    let multiplier = getControlRatingMultipland(controlRating);
    modifiers === null || modifiers === void 0 ? void 0 : modifiers.forEach(modifier => {
        if (modifier.enabled) {
            let mod = costModifier(modifier);
            switch (modifier.costType) {
                case TraitModifierType.Percentage:
                default:
                    switch (modifier.affects) {
                        case TraitModifierAffects.Total:
                        default:
                            if (mod < 0) {
                                baseLim += mod;
                                levelLim += mod;
                            }
                            else {
                                baseEnh += mod;
                                levelEnh += mod;
                            }
                            break;
                        case TraitModifierAffects.Base:
                            if (mod < 0) {
                                baseLim += mod;
                            }
                            else {
                                baseEnh += mod;
                            }
                            break;
                        case TraitModifierAffects.Levels:
                            if (mod < 0) {
                                levelLim += mod;
                            }
                            else {
                                levelEnh += mod;
                            }
                            break;
                    }
                    break;
                case TraitModifierType.Points:
                    switch (modifier.affects) {
                        case TraitModifierAffects.Total:
                        case TraitModifierAffects.Base:
                        default:
                            basePoints += mod;
                            break;
                        case TraitModifierAffects.Levels:
                            pointsPerLevel += mod;
                            break;
                    }
                    break;
                case TraitModifierType.Multiplier:
                    multiplier *= mod;
                    break;
            }
        }
    });
    let modifiedBasePoints = basePoints;
    let leveledPoints = hasLevels ?
        pointsPerLevel * (levels + (hasHalfLevel ? .5 : 0)) || 0
        : 0;
    if (baseEnh !== 0 || baseLim !== 0 || levelEnh !== 0 || levelLim !== 0) {
        if (false) {}
        else {
            let baseMod = Math.max(baseEnh + baseLim, -80);
            let levelMod = Math.max(levelEnh + levelLim, -80);
            modifiedBasePoints = baseMod === levelMod ?
                modifyPoints((modifiedBasePoints + leveledPoints), baseMod) :
                modifyPoints(modifiedBasePoints, baseMod) + modifyPoints(leveledPoints, levelMod);
        }
    }
    else {
        modifiedBasePoints += (leveledPoints);
    }
    return applyRounding((modifiedBasePoints * multiplier), Boolean(roundDown)) || 0;
}
function getControlRatingMultipland(cr) {
    switch (cr) {
        case ControlRating.CannotResist: return 2.5;
        case ControlRating.ResistRarely: return 2;
        case ControlRating.ResistFairlyOften: return 1.5;
        case ControlRating.ResistQuiteOften: return 1;
        case ControlRating.ResistAlmostAlway: return 0.5;
        default: return 1;
    }
}
function costModifier(modifier) {
    return modifier.hasLevels && modifier.levels > 0 ? modifier.cost * modifier.levels : modifier.cost;
}
function modifyPoints(points, modifier) { return points + calculateModifierPoints(points, modifier); }
function calculateModifierPoints(points, modifier) { return points * (modifier / 100); }
function applyRounding(value, roundCostDown) { return roundCostDown ? Math.floor(value) : Math.ceil(value); }
var TraitCategory;
(function (TraitCategory) {
    TraitCategory["Advantage"] = "advantage";
    TraitCategory["Perk"] = "perk";
    TraitCategory["Disadavantage"] = "disadvantage";
    TraitCategory["Quirk"] = "quirk";
    TraitCategory["Feature"] = "feature";
    TraitCategory["Racial"] = "racial";
    TraitCategory["Meta"] = "meta";
    TraitCategory["Language"] = "language";
    TraitCategory["Culture"] = "culture";
    TraitCategory[TraitCategory["Never"] = -1] = "Never";
})(TraitCategory || (TraitCategory = {}));
function isAdvantage(trait) {
    return trait.basePoints > 1
        || trait.pointsPerLevel > 1
        || calculateTraitCost(trait) > 1;
}
function isPerk(trait) {
    return (trait.basePoints === 1 || !trait.basePoints)
        && (trait.hasLevels ? trait.pointsPerLevel === 1 : true)
        && calculateTraitCost(trait) !== 0;
}
function isDisadvantage(trait) {
    return trait.basePoints < -1
        || trait.pointsPerLevel < -1
        || calculateTraitCost(trait) < -1;
}
function isQuirk(trait) {
    return (trait.basePoints === -1 || !trait.basePoints)
        && (trait.hasLevels ? trait.pointsPerLevel === -1 : true)
        && calculateTraitCost(trait) !== 0;
}
function isFeature(trait) {
    return !trait.basePoints
        && !trait.pointsPerLevel
        && calculateTraitCost(trait) === 0;
}
function getCategory(tags) {
    const categories = tags.join(' ');
    if (/meta/i.test(categories))
        return TraitCategory.Meta;
    if (/racial/i.test(categories))
        return TraitCategory.Racial;
    if (/quirk/i.test(categories))
        return TraitCategory.Quirk;
    if (/disadvantage/i.test(categories))
        return TraitCategory.Disadavantage;
    if (/perk/i.test(categories))
        return TraitCategory.Perk;
    if (/advantage/i.test(categories))
        return TraitCategory.Advantage;
    if (/feature/i.test(categories))
        return TraitCategory.Feature;
    return -1;
}
function getContainerType(traits) {
    let racial = false;
    let perk = false;
    let advantage = false;
    let quirk = false;
    let disadvantage = false;
    let feature = false;
    let types = traits.map(child => {
        let type = getTraitType(child);
        switch (type) {
            case TraitCategory.Racial:
                racial = true;
                break;
            case TraitCategory.Perk:
                perk = true;
                break;
            case TraitCategory.Advantage:
                advantage = true;
                break;
            case TraitCategory.Quirk:
                quirk = true;
                break;
            case TraitCategory.Disadavantage:
                disadvantage = true;
                break;
            case TraitCategory.Feature:
                feature = true;
                break;
        }
        return type;
    });
    if (!types.some(type => type !== TraitCategory.Racial))
        return TraitCategory.Racial;
    if (!types.some(type => type !== TraitCategory.Advantage))
        return TraitCategory.Advantage;
    if (!types.some(type => type !== TraitCategory.Perk))
        return TraitCategory.Perk;
    if (!types.some(type => type !== TraitCategory.Disadavantage))
        return TraitCategory.Disadavantage;
    if (!types.some(type => type !== TraitCategory.Quirk))
        return TraitCategory.Quirk;
    if (!types.some(type => type !== TraitCategory.Feature))
        return TraitCategory.Feature;
    if (!advantage && !perk && (disadvantage || quirk))
        return TraitCategory.Disadavantage;
    if (!disadvantage && !quirk && (advantage || perk))
        return TraitCategory.Advantage;
    return TraitCategory.Meta;
}
function getTraitType(trait) {
    var _a, _b;
    if (!trait)
        return TraitCategory.Never;
    const { categories } = trait;
    const children = ((_b = (_a = trait === null || trait === void 0 ? void 0 : trait.children) === null || _a === void 0 ? void 0 : _a.trait) !== null && _b !== void 0 ? _b : []);
    let type = getCategory(categories);
    if (children.length > 0) {
        return getContainerType(children);
    }
    if (type !== TraitCategory.Never)
        return type;
    const advantage = isAdvantage(trait);
    const perk = isPerk(trait);
    const disadvantage = isDisadvantage(trait);
    const quirk = isQuirk(trait);
    const feature = isFeature(trait);
    if (disadvantage)
        return TraitCategory.Disadavantage;
    if (quirk)
        return TraitCategory.Quirk;
    if (advantage)
        return TraitCategory.Advantage;
    if (perk)
        return TraitCategory.Perk;
    if (feature)
        return TraitCategory.Feature;
    type = TraitCategory.Meta;
    return type;
}
function split(traits) {
    if (!traits)
        return {};
    const splits = {
        [TraitCategory.Advantage]: traits.filter(trait => getTraitType(trait) === TraitCategory.Advantage),
        [TraitCategory.Disadavantage]: traits.filter(trait => getTraitType(trait) === TraitCategory.Disadavantage),
        [TraitCategory.Racial]: traits.filter(trait => getTraitType(trait) === TraitCategory.Racial),
        [TraitCategory.Meta]: traits.filter(trait => getTraitType(trait) === TraitCategory.Meta),
        [TraitCategory.Perk]: traits.filter(trait => getTraitType(trait) === TraitCategory.Perk),
        [TraitCategory.Quirk]: traits.filter(trait => getTraitType(trait) === TraitCategory.Quirk),
        [TraitCategory.Feature]: traits.filter(trait => getTraitType(trait) === TraitCategory.Feature)
    };
    return removeDuplicates(splits);
}
function sumTraitArray(traits) {
    var _a;
    return (_a = traits === null || traits === void 0 ? void 0 : traits.reduce((total, trait) => calculateTraitCost(trait) + total, 0)) !== null && _a !== void 0 ? _a : 0;
}
function removeDuplicates(lists) {
    const checked = new Set();
    return Object.entries(lists).reduce((prev, [type, list]) => {
        checked.add(type);
        const checkAgainst = Object.entries(lists)
            .filter(([key1, list]) => {
            type !== key1 && !checked.has(key1);
        })
            .flatMap(values => values[1])
            .map(list => list.id);
        let newCollection = list.filter(item => !checkAgainst.includes(item.id));
        prev[type] = newCollection;
        return prev;
    }, {});
}


/***/ }),

/***/ "./src/gurps/workerscripts/character.worker.ts":
/*!*****************************************************!*\
  !*** ./src/gurps/workerscripts/character.worker.ts ***!
  \*****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var comlink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! comlink */ "./node_modules/comlink/dist/esm/comlink.mjs");
/* harmony import */ var _resources_character__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../resources/character */ "./src/gurps/resources/character.ts");


self["onconnect"] = e => Object(comlink__WEBPACK_IMPORTED_MODULE_0__["expose"])(_resources_character__WEBPACK_IMPORTED_MODULE_1__["Character"], e.ports[0]);


/***/ })

/******/ });
//# sourceMappingURL=character-worker.js.map