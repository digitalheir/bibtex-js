"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var BibFile_1 = require("../BibFile");
var Preamble = (function () {
    function Preamble(data) {
        this.type = ("preamble");
        this.data = data;
        this.string = data.join("");
    }
    Preamble.prototype.toString = function () {
        return this.string;
    };
    return Preamble;
}());
exports.Preamble = Preamble;
function isPreamble(x) {
    return x.type === "preamble" && !!x.data;
}
exports.isPreamble = isPreamble;
function newPreambleNode(data) {
    var flattened = BibFile_1.parseBibEntriesAndNonEntries(util_1.mustBeArray(data.data));
    return new Preamble(flattened);
}
exports.newPreambleNode = newPreambleNode;
//# sourceMappingURL=BibPreamble.js.map