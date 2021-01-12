"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = require("./Token");
var WhitespaceToken_1 = require("./WhitespaceToken");
var NumericToken_1 = require("./NumericToken");
function newIdToken(string) {
    return {
        type: "id",
        string: string
    };
}
exports.newIdToken = newIdToken;
function isIdToken(string) {
    return string.type === "id" && typeof string.string === "string";
}
exports.isIdToken = isIdToken;
function isIdChar(c) {
    return !(Token_1.isSpecialChar(c) || NumericToken_1.isNum(c) || WhitespaceToken_1.isSingleWhiteSpaceCharacter(c));
}
exports.isIdChar = isIdChar;
//# sourceMappingURL=IdToken.js.map