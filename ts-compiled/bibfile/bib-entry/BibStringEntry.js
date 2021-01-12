"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyVal_1 = require("../datatype/KeyVal");
var StringRef_1 = require("../datatype/string/StringRef");
var QuotedString_1 = require("../datatype/string/QuotedString");
var BracedString_1 = require("../datatype/string/BracedString");
var util_1 = require("../../util");
var bib_string_utils_1 = require("../datatype/string/bib-string-utils");
var BibStringEntry = (function () {
    function BibStringEntry(key, value) {
        this.type = "string";
        this.key = key;
        this.value = value;
    }
    return BibStringEntry;
}());
exports.BibStringEntry = BibStringEntry;
function newStringEntry(data) {
    var _a = convertToKeyVal(data), key = _a.key, value = _a.value;
    return new BibStringEntry(key, value);
}
exports.newStringEntry = newStringEntry;
function convertToKeyVal(data) {
    if (KeyVal_1.isKeyVal(data)) {
        return KeyVal_1.newKeyVal(data);
    }
    else {
        if (data.type !== "string") {
            throw new Error("Unexpected node: " + JSON.stringify(data));
        }
        return convertToKeyVal(data.data);
    }
}
function resolveStrings(strings) {
    var resolved = {};
    Object.keys(strings).forEach(function (key) {
        if (!resolved[key])
            resolved[key] = resolveStringReference({}, resolved, strings, strings[key]);
    });
    return resolved;
}
exports.resolveStrings = resolveStrings;
function resolveStringReferences(o, seenBeforeStack, alreadyResolved, refs) {
    return o.data.map(function (datum) {
        if (util_1.isString(datum) || util_1.isNumber(datum))
            return datum;
        else if (StringRef_1.isStringRef(datum))
            return resolveStringRef(seenBeforeStack, refs, datum, alreadyResolved);
        else if (bib_string_utils_1.isBibStringComponent(datum))
            return copyWithResolvedStringReferences(datum, seenBeforeStack, alreadyResolved, refs);
        else
            throw new Error();
    });
}
exports.resolveStringReferences = resolveStringReferences;
function resolveStringReference(seenBeforeStack, alreadyResolved, refs, data) {
    if (util_1.isNumber(data)) {
        return data;
    }
    else if (BracedString_1.isOuterBracedString(data) || QuotedString_1.isOuterQuotedString(data)) {
        return copyOuterWithResolvedStringReferences(data, seenBeforeStack, alreadyResolved, refs);
    }
    if (StringRef_1.isStringRef(data)) {
        return resolveStringRef(seenBeforeStack, refs, data, alreadyResolved);
    }
    return data;
}
exports.resolveStringReference = resolveStringReference;
function resolveStringRef(seenBeforeStack, refs, data, alreadyResolved) {
    var refName = data.stringref;
    if (seenBeforeStack[refName])
        throw new Error("Cycle detected: " + refName);
    if (alreadyResolved[refName]) {
        return alreadyResolved[refName];
    }
    if (!refs[refName])
        throw new Error("Unresolved reference: \"" + data.stringref + "\" (" + JSON.stringify(data) + ")");
    alreadyResolved[refName] = resolveStringReference(Object.assign({}, seenBeforeStack, (_a = {}, _a[refName] = true, _a)), alreadyResolved, refs, refs[refName]);
    return alreadyResolved[refName];
    var _a;
}
function copyWithResolvedStringReferences(obj, seenBeforeStack, alreadyResolved, refs) {
    var newData = resolveStringReferences(obj, seenBeforeStack, alreadyResolved, refs);
    var braceDepth = obj.braceDepth;
    if (QuotedString_1.isQuotedString(obj))
        return new QuotedString_1.QuotedString(braceDepth, newData);
    if (BracedString_1.isBracedString(obj))
        return new BracedString_1.BracedString(braceDepth, newData);
    if (QuotedString_1.isOuterQuotedString(obj))
        return new QuotedString_1.OuterQuotedString(newData);
    if (BracedString_1.isOuterBracedString(obj))
        return new BracedString_1.OuterBracedString(newData);
    else
        throw new Error();
}
exports.copyWithResolvedStringReferences = copyWithResolvedStringReferences;
function copyOuterWithResolvedStringReferences(obj, seenBeforeStack, alreadyResolved, refs) {
    var copied = copyWithResolvedStringReferences(obj, seenBeforeStack, alreadyResolved, refs);
    if (!BracedString_1.isOuterBracedString(copied) && !QuotedString_1.isOuterQuotedString(copied))
        throw new Error();
    return copied;
}
exports.copyOuterWithResolvedStringReferences = copyOuterWithResolvedStringReferences;
//# sourceMappingURL=BibStringEntry.js.map