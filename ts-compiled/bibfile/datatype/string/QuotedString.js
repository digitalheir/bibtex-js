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
var QuotedString = (function (_super) {
    __extends(QuotedString, _super);
    function QuotedString(braceDepth, data) {
        return _super.call(this, "quotedstring", braceDepth, data) || this;
    }
    return QuotedString;
}(BibStringComponent_1.BibStringComponent));
exports.QuotedString = QuotedString;
var OuterQuotedString = (function (_super) {
    __extends(OuterQuotedString, _super);
    function OuterQuotedString(data) {
        return _super.call(this, "quotedstringwrapper", data) || this;
    }
    return OuterQuotedString;
}(BibStringComponent_1.BibOuterStringComponent));
exports.OuterQuotedString = OuterQuotedString;
function isOuterQuotedString(x) {
    return x.type === "quotedstringwrapper";
}
exports.isOuterQuotedString = isOuterQuotedString;
function isQuotedString(x) {
    return x.type === "quotedstring";
}
exports.isQuotedString = isQuotedString;
//# sourceMappingURL=QuotedString.js.map