"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var BibComment = (function () {
    function BibComment(data) {
        this.type = "comment";
        this.data = data;
        this.string = data.join("");
    }
    BibComment.prototype.toString = function () {
        return this.string;
    };
    return BibComment;
}());
exports.BibComment = BibComment;
var CommentEntry = (function () {
    function CommentEntry(type, data) {
        this.type = type;
        this.data = data;
        this.string = data.join("");
    }
    CommentEntry.prototype.toString = function () {
        return this.string;
    };
    return CommentEntry;
}());
exports.CommentEntry = CommentEntry;
function isBibComment(n) {
    return n.type === "comment" && util_1.isArray(n.data);
}
exports.isBibComment = isBibComment;
var flattenO = function (wrapper) { return util_1.isString(wrapper) ? wrapper
    : typeof wrapper === "number" ? wrapper.toString()
        : wrapper["type"] === "@bib" ? "@" + util_1.mustBeString(wrapper.string)
            : wrapper["type"] === "escapedEntry" ? "\\" + flattenO(wrapper.data)
                : util_1.mustBeString(wrapper.string); };
function flattenPlainText(data) {
    return util_1.flattenMyArray(data).map(flattenO);
}
exports.flattenPlainText = flattenPlainText;
//# sourceMappingURL=BibComment.js.map