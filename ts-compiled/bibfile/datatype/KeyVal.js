"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BracedString_1 = require("./string/BracedString");
var QuotedString_1 = require("./string/QuotedString");
var util_1 = require("../../util");
var bib_string_utils_1 = require("./string/bib-string-utils");
function isKeyVal(data) {
    return typeof data.key === "string"
        && data.value !== undefined;
}
exports.isKeyVal = isKeyVal;
function newKeyVal(data) {
    if (isKeyVal(data)) {
        return {
            key: data.key,
            value: parseFieldValue(data.value),
        };
    }
    else {
        throw new Error("Was not a KeyVal: " + JSON.stringify(data));
    }
}
exports.newKeyVal = newKeyVal;
function parseFieldValue(value) {
    if (util_1.isNumber(value)) {
        return value;
    }
    var data = util_1.mustBeArray(value.data);
    switch (value.type) {
        case "quotedstringwrapper":
            if (data.length === 1 && util_1.isNumber(data[0]))
                return data[0];
            return new QuotedString_1.OuterQuotedString(data.map(function (e) { return bib_string_utils_1.parseStringComponent(0, e); }));
        case "bracedstringwrapper":
            return new BracedString_1.OuterBracedString(data.map(function (e) { return bib_string_utils_1.parseStringComponent(0, e); }));
        default:
            throw new Error("Unexpected value: " + JSON.stringify(value));
    }
}
exports.parseFieldValue = parseFieldValue;
function normalizeFieldValue(field) {
    if (!field)
        return undefined;
    if (util_1.isNumber(field))
        return field;
    else
        return field.stringify();
}
exports.normalizeFieldValue = normalizeFieldValue;
//# sourceMappingURL=KeyVal.js.map