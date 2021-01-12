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
var Author_1 = require("./Author");
var QuotedString_1 = require("../../datatype/string/QuotedString");
var BibStringComponent_1 = require("../../datatype/string/BibStringComponent");
var bib_string_utils_1 = require("../../datatype/string/bib-string-utils");
var Authors = (function (_super) {
    __extends(Authors, _super);
    function Authors(fieldValue) {
        var _this = this;
        var data = util_1.isNumber(fieldValue) ? [fieldValue] : fieldValue.data;
        _this = _super.call(this, "authors", data) || this;
        var authorNames = determineAuthorNames$(fieldValue);
        _this.authors$ = authorNames.map(function (name) { return parseAuthor(name); });
        return _this;
    }
    return Authors;
}(BibStringComponent_1.BibOuterStringComponent));
exports.Authors = Authors;
function parseAuthor(data) {
    return Author_1.parseAuthorName(data);
}
function determineAuthorNames$(data) {
    if (util_1.isNumber(data)) {
        return determineAuthorNames([data]);
    }
    else {
        return determineAuthorNames(data.data, QuotedString_1.isOuterQuotedString(data));
    }
}
exports.determineAuthorNames$ = determineAuthorNames$;
function determineAuthorNames(data, hideQuotes) {
    var globbed = bib_string_utils_1.globContiguousStrings(bib_string_utils_1.flattenQuotedStrings(data, hideQuotes));
    var normalizedString = globbed.map(function (e) { return bib_string_utils_1.isContiguousSimpleString(e) ? bib_string_utils_1.joinContiguousSimpleStrings(e) : e; });
    return bib_string_utils_1.splitOnAnd(normalizedString);
}
function mustBeAuthors(x) {
    if (!isAuthors(x))
        throw new Error();
    return x;
}
exports.mustBeAuthors = mustBeAuthors;
function isAuthors(x) {
    return (util_1.isArray(x["authors$"]) && x.type === "authors");
}
exports.isAuthors = isAuthors;
//# sourceMappingURL=Authors.js.map