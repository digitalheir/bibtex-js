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
var BibStringComponent_1 = require("./BibStringComponent");
var BracedString = (function (_super) {
    __extends(BracedString, _super);
    function BracedString(braceDepth, data) {
        var _this = _super.call(this, "bracedstring", braceDepth, data) || this;
        _this.isSpecialCharacter = braceDepth === 0 && data[0] === "\\";
        return _this;
    }
    return BracedString;
}(BibStringComponent_1.BibStringComponent));
exports.BracedString = BracedString;
var OuterBracedString = (function (_super) {
    __extends(OuterBracedString, _super);
    function OuterBracedString(data) {
        return _super.call(this, "bracedstringwrapper", data) || this;
    }
    return OuterBracedString;
}(BibStringComponent_1.BibOuterStringComponent));
exports.OuterBracedString = OuterBracedString;
function isOuterBracedString(x) {
    return x.type === "bracedstringwrapper";
}
exports.isOuterBracedString = isOuterBracedString;
function isBracedString(x) {
    return x.type === "bracedstring";
}
exports.isBracedString = isBracedString;
//# sourceMappingURL=BracedString.js.map