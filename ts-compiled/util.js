"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mustBeString(str, o) {
    if (typeof str !== "string")
        throw new Error("Expected to be string: " + JSON.stringify(o ? o : str));
    return str;
}
exports.mustBeString = mustBeString;
function mustBeDefined(t, o) {
    if (t === undefined)
        throw new Error("Expected to be defined: " + JSON.stringify(o ? o : t));
    return t;
}
exports.mustBeDefined = mustBeDefined;
function mustBeArray(str, o) {
    if (!isArray(str))
        throw new Error("Expected to be array: " + JSON.stringify(o ? o : str));
    return str;
}
exports.mustBeArray = mustBeArray;
function isArray(data) {
    return !!data && data.constructor === Array;
}
exports.isArray = isArray;
function isNumber(data) {
    return typeof data === "number";
}
exports.isNumber = isNumber;
function isString(data) {
    return typeof data === "string";
}
exports.isString = isString;
exports.flattenMyArray = function (arr, result) {
    if (!result)
        result = [];
    for (var i = 0, length = arr.length; i < length; i++) {
        var value = arr[i];
        if (Array.isArray(value)) {
            for (var i_1 = 0, length_1 = value.length; i_1 < length_1; i_1++) {
                var value2 = value[i_1];
                if (Array.isArray(value2)) {
                    exports.flattenMyArray(value2, result);
                }
                else {
                    result.push(value2);
                }
            }
        }
        else {
            result.push(value);
        }
    }
    return result;
};
//# sourceMappingURL=util.js.map