"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringRef = (function () {
    function StringRef(braceDepth, stringref) {
        this.braceDepth = braceDepth;
        this.stringref = stringref;
    }
    return StringRef;
}());
exports.StringRef = StringRef;
function isStringRef(stringref) {
    return typeof stringref.stringref === "string";
}
exports.isStringRef = isStringRef;
//# sourceMappingURL=StringRef.js.map