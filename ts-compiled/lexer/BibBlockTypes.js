"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bibTypes = {
    string: "@string",
    preamble: "@preamble",
    comment: "@comment",
    bib: "@bib"
};
exports.isBibType = function (c) {
    return exports.bibTypes.hasOwnProperty(c);
};
//# sourceMappingURL=BibBlockTypes.js.map