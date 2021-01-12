"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
var BibStringComponent = (function () {
    function BibStringComponent(type, braceDepth, data) {
        this.type = type;
        this.braceDepth = braceDepth;
        this.data = data;
    }
    BibStringComponent.prototype.stringify = function () {
        return this.data.map(stringifyDatum).join("");
    };
    return BibStringComponent;
}());
exports.BibStringComponent = BibStringComponent;
function isBibStringComponent(x) {
    return typeof x.braceDepth === "number" && typeof x.type === "string";
}
function stringifyDatum(datum) {
    if (util_1.isString(datum))
        return datum;
    if (util_1.isNumber(datum))
        return datum.toString();
    if (isBibStringComponent(datum))
        return datum.stringify();
    else
        throw new Error("Unexpected state");
}
exports.stringifyDatum = stringifyDatum;
var BibOuterStringComponent = (function (_super) {
    __extends(BibOuterStringComponent, _super);
    function BibOuterStringComponent(type, data) {
        return _super.call(this, type, 0, data) || this;
    }
    return BibOuterStringComponent;
}(BibStringComponent));
exports.BibOuterStringComponent = BibOuterStringComponent;
//# sourceMappingURL=BibStringComponent.js.map