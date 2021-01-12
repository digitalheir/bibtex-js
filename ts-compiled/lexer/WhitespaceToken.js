"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS = "ws";
function newWhitespace(string) {
    return {
        type: "ws",
        string: string
    };
}
exports.newWhitespace = newWhitespace;
function isWhitespace(token) {
    return typeof token.string === "string" && token.type === exports.WS;
}
exports.isWhitespace = isWhitespace;
exports.singleWhitespaces = {
    " ": true,
    "\t": true,
    "\r": true,
    "\n": true
};
function isSingleWhiteSpaceCharacter(c) {
    return exports.singleWhitespaces.hasOwnProperty(c);
}
exports.isSingleWhiteSpaceCharacter = isSingleWhiteSpaceCharacter;
//# sourceMappingURL=WhitespaceToken.js.map