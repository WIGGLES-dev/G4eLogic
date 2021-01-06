webpackHotUpdate("gurps",{

/***/ "./src/extend.ts":
/*!***********************!*\
  !*** ./src/extend.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var rxdeep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxdeep */ "./node_modules/rxdeep/dist/es6/index.js");
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! deepmerge */ "./node_modules/deepmerge/dist/cjs.js");
/* harmony import */ var deepmerge__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(deepmerge__WEBPACK_IMPORTED_MODULE_1__);


rxdeep__WEBPACK_IMPORTED_MODULE_0__["State"].prototype.set = function (value) {
    if (typeof value === 'object') {
        const current = this.value;
        const next = deepmerge__WEBPACK_IMPORTED_MODULE_1___default()(current, value, {
            arrayMerge: (t, s) => s
        });
        this.value = next;
    }
    else {
        this.value = value;
    }
};
rxdeep__WEBPACK_IMPORTED_MODULE_0__["State"].prototype.sub = function (...keys) {
};


/***/ })

})
//# sourceMappingURL=gurps.b43a3197dcb297afa440.hot-update.js.map