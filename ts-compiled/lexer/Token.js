"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function newToken(type, string) {
    return {
        type: type,
        string: string
    };
}
exports.newToken = newToken;
exports.specialChars = {
    "@": true,
    "(": true,
    ")": true,
    "{": true,
    "}": true,
    "#": true,
    "=": true,
    ",": true,
    "\\": true,
    "\"": true,
};
function isSpecialChar(c) {
    return exports.specialChars.hasOwnProperty(c);
}
exports.isSpecialChar = isSpecialChar;
exports.escapableChars = {
    "\\": true,
    "@": true,
    "{": true,
    "}": true
};
function isEscapableChar(c) {
    return exports.escapableChars.hasOwnProperty(c);
}
exports.isEscapableChar = isEscapableChar;
//# sourceMappingURL=Token.js.map