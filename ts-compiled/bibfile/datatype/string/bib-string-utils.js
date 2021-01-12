"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringRef_1 = require("./StringRef");
var BracedString_1 = require("./BracedString");
var QuotedString_1 = require("./QuotedString");
var util_1 = require("../../../util");
function isBibStringComponent(x) {
    return typeof x.braceDepth === "number" && typeof x.type === "string";
}
exports.isBibStringComponent = isBibStringComponent;
function isContiguousSimpleString(x) {
    return x.type === "ContiguousSimpleString" && util_1.isArray(x.data);
}
exports.isContiguousSimpleString = isContiguousSimpleString;
function joinContiguousSimpleStrings(x) {
    return x.data.join("");
}
exports.joinContiguousSimpleStrings = joinContiguousSimpleStrings;
function parseStringComponent(braceDepth, obj) {
    if (util_1.isNumber(obj) || util_1.isString(obj))
        return obj;
    if (StringRef_1.isStringRef(obj))
        return new StringRef_1.StringRef(0, obj.stringref);
    switch (util_1.mustBeString(obj.type, obj)) {
        case "id":
        case "ws":
        case "number":
            return util_1.mustBeString(obj.string);
        case "bracedstring":
        case "braced":
            if (!util_1.isArray(obj.data)) {
                throw new Error("Expect array for data: " + JSON.stringify(obj));
            }
            return new BracedString_1.BracedString(braceDepth, util_1.flattenMyArray(obj.data).map(function (e) { return parseStringComponent(braceDepth + 1, e); }));
        case "quotedstring":
            if (!util_1.isArray(obj.data)) {
                throw new Error("Expect array for data: " + JSON.stringify(obj));
            }
            var flattened = util_1.flattenMyArray(obj.data);
            return new QuotedString_1.QuotedString(braceDepth, flattened.map(function (e) { return parseStringComponent(braceDepth, e); }));
        default:
            throw new Error("Unexpected complex string type: " + obj.type);
    }
}
exports.parseStringComponent = parseStringComponent;
function toStringBibStringDatum(data) {
    if (util_1.isString(data))
        return data;
    if (util_1.isNumber(data))
        return data + "";
    if (BracedString_1.isBracedString(data)
        || QuotedString_1.isQuotedString(data)
        || QuotedString_1.isOuterQuotedString(data)
        || BracedString_1.isOuterBracedString(data))
        return toStringBibStringData(data.data);
    throw new Error(JSON.stringify(data));
}
exports.toStringBibStringDatum = toStringBibStringDatum;
function toStringBibStringData(data) {
    return data.map(toStringBibStringDatum).join("");
}
exports.toStringBibStringData = toStringBibStringData;
function flattenQuotedStrings(data, hideQuotes) {
    var result = [];
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var datum = data_1[_i];
        var flattenned = flattenQuotedString(datum, hideQuotes);
        if (util_1.isArray(flattenned)) {
            result = result.concat(flattenned);
        }
        else {
            result.push(flattenned);
        }
    }
    return result;
}
exports.flattenQuotedStrings = flattenQuotedStrings;
var doubleQuotes = ["\""];
function flattenQuotedString(data, hideQuotes) {
    if (BracedString_1.isBracedString(data))
        return data;
    if (QuotedString_1.isQuotedString(data)) {
        var flattenedQuotedString = flattenQuotedStrings(data.data, true);
        if (util_1.isArray(flattenedQuotedString)) {
            return hideQuotes
                ? flattenedQuotedString
                : doubleQuotes.concat(flattenedQuotedString).concat(doubleQuotes);
        }
        else if (hideQuotes)
            return flattenedQuotedString;
        else
            return ["\"", flattenedQuotedString, "\""];
    }
    if (QuotedString_1.isOuterQuotedString(data))
        return flattenQuotedStrings(data.data, true);
    if (BracedString_1.isOuterBracedString(data))
        return flattenQuotedStrings(data.data, false);
    if (util_1.isString(data) || util_1.isNumber(data))
        return data;
    if (StringRef_1.isStringRef(data))
        throw new Error("StringRef should be resolved at this point!");
    else
        throw new Error();
}
function globContiguousStrings(data) {
    var result = [];
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var element = data_2[_i];
        if (util_1.isString(element) || util_1.isNumber(element)) {
            if (result.length <= 0) {
                var contiguousSimpleString = {
                    type: "ContiguousSimpleString",
                    data: [element]
                };
                result.push(contiguousSimpleString);
            }
            else {
                var lastElement = result[result.length - 1];
                if (isContiguousSimpleString(lastElement)) {
                    lastElement.data.push(element);
                }
                else {
                    var contiguousSimpleString = {
                        type: "ContiguousSimpleString",
                        data: [element]
                    };
                    result.push(contiguousSimpleString);
                }
            }
        }
        else {
            result.push(element);
        }
    }
    return result;
}
exports.globContiguousStrings = globContiguousStrings;
function splitOnAnd(data) {
    return splitOnPattern(data, /\s+and\s+/g);
}
exports.splitOnAnd = splitOnAnd;
function splitOnComma(data, limit) {
    if (limit === void 0) { limit = 2; }
    return splitOnPattern(data, /\s*,\s*/g, limit);
}
exports.splitOnComma = splitOnComma;
function splitOnPattern(data, pattern, stopAfter) {
    var splitted = [];
    var buffer = [];
    for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
        var datum = data_3[_i];
        if (util_1.isString(datum) && (stopAfter === undefined || stopAfter > 0)) {
            var match = pattern.exec(datum);
            var end = 0;
            if (match) {
                do {
                    var prevEnd = end;
                    end = match.index + match[0].length;
                    buffer.push(datum.substring(prevEnd, match.index));
                    if (stopAfter === undefined || stopAfter > 0) {
                        splitted.push(buffer);
                        buffer = [];
                        if (stopAfter !== undefined && stopAfter > 0)
                            stopAfter--;
                    }
                    if (stopAfter === undefined || stopAfter > 0)
                        match = pattern.exec(datum);
                    else
                        match = undefined;
                } while (match);
                if (end > 0 && end < datum.length)
                    buffer.push(datum.substring(end));
            }
            else {
                buffer.push(datum);
            }
        }
        else
            buffer.push(datum);
    }
    if (buffer.length > 0)
        splitted.push(buffer);
    return splitted;
}
exports.splitOnPattern = splitOnPattern;
//# sourceMappingURL=bib-string-utils.js.map