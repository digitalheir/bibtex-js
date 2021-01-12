"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function newNumber(string) {
    return {
        type: "number",
        string: string
    };
}
exports.newNumber = newNumber;
exports.numericChars = {
    "0": true,
    "1": true,
    "2": true,
    "3": true,
    "4": true,
    "5": true,
    "6": true,
    "7": true,
    "8": true,
    "9": true
};
function isNum(c) {
    return exports.numericChars.hasOwnProperty(c);
}
exports.isNum = isNum;
//# sourceMappingURL=NumericToken.js.map