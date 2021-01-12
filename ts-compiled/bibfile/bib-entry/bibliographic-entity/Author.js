"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
var QuotedString_1 = require("../../datatype/string/QuotedString");
var StringRef_1 = require("../../datatype/string/StringRef");
var BracedString_1 = require("../../datatype/string/BracedString");
var bib_string_utils_1 = require("../../datatype/string/bib-string-utils");
function word2string(obj) {
    if (typeof obj === "string")
        return obj;
    else if (obj.type == "braced")
        return word2string(obj.data);
    else if (obj.unicode)
        return obj.unicode;
    else if (obj.string)
        return obj.string;
    else if (obj.constructor == Array)
        return obj.map(word2string).join("");
    else
        throw new Error("? " + JSON.stringify(obj));
}
var WHITESPACES = /\s+/g;
var AuthorName = (function () {
    function AuthorName(firstNames, vons, lastNames, jrs) {
        this.firstNames$ = firstNames;
        this.vons$ = vons;
        this.lastNames$ = lastNames;
        this.jrs$ = jrs;
        this.initials = firstNames.map(getFirstLetter);
        this.firstNames = firstNames.map(bib_string_utils_1.toStringBibStringData);
        this.vons = vons.map(bib_string_utils_1.toStringBibStringData);
        this.lastNames = lastNames.map(bib_string_utils_1.toStringBibStringData);
        this.jrs = jrs.map(bib_string_utils_1.toStringBibStringData);
        this.id = this.firstNames.join("-") + "-"
            + this.vons.join("-") + "-"
            + this.lastNames.join("-") + "-"
            + this.jrs.join("-");
    }
    return AuthorName;
}());
exports.AuthorName = AuthorName;
function getFirstLetter(bsd) {
    var asString = bib_string_utils_1.toStringBibStringData(bsd);
    return asString ? asString.charAt(0) : "";
}
function isPartOfName(char) {
    return (char === "," || char.match(/\s/));
}
function startsWithLowerCaseBSD(authorToken) {
    if (authorToken.length > 0)
        return startsWithLowerCase(authorToken[0]);
    else
        return false;
}
function startsWithLowerCase(authorToken) {
    if (util_1.isString(authorToken)) {
        if (!authorToken)
            return false;
        var ch = authorToken.charAt(0);
        return ch.toLowerCase() === ch && ch.toUpperCase() !== ch;
    }
    if (QuotedString_1.isQuotedString(authorToken)) {
        if (!authorToken.data || authorToken.data.length <= 0)
            return false;
        return startsWithLowerCase(authorToken.data[0]);
    }
    if (StringRef_1.isStringRef(authorToken)
        || QuotedString_1.isOuterQuotedString(authorToken)
        || BracedString_1.isOuterBracedString(authorToken))
        throw new Error("Should not do this test on this type");
    return false;
}
function firstVonLast(outer) {
    var authorTokens = bib_string_utils_1.splitOnPattern(outer, WHITESPACES);
    var vonStartInclusive = -1;
    var vonEndExclusive = -1;
    var firstNameEndExclusive = -1;
    for (var i = 0; i < authorTokens.length - 1; i++) {
        if (startsWithLowerCaseBSD(authorTokens[i])) {
            if (vonStartInclusive < 0)
                vonStartInclusive = i;
            vonEndExclusive = i + 1;
        }
    }
    if (vonStartInclusive >= 0)
        firstNameEndExclusive = vonStartInclusive;
    else
        firstNameEndExclusive = authorTokens.length - 1;
    var von = vonStartInclusive >= 0 ? getSubStringAsArray(authorTokens, vonStartInclusive, vonEndExclusive) : [];
    var firstName = getSubStringAsArray(authorTokens, 0, firstNameEndExclusive);
    var lastName = getSubStringAsArray(authorTokens, Math.max(vonEndExclusive, firstNameEndExclusive), authorTokens.length);
    return new AuthorName(firstName, von, lastName, []);
}
function vonLastFirst(vonLastStr, firstStr) {
    var vonLast = bib_string_utils_1.splitOnPattern(vonLastStr, WHITESPACES);
    var first = bib_string_utils_1.splitOnPattern(firstStr, WHITESPACES);
    var vonStartInclusive = -1;
    var vonEndExclusive = -1;
    for (var i = 0; i < vonLast.length - 1; i++)
        if (startsWithLowerCaseBSD(vonLast[i])) {
            if (vonStartInclusive < 0)
                vonStartInclusive = i;
            vonEndExclusive = i + 1;
        }
    var von = vonStartInclusive >= 0 ? getSubStringAsArray(vonLast, 0, vonEndExclusive) : [];
    var firstName = first;
    var lastName = getSubStringAsArray(vonLast, Math.max(vonEndExclusive, 0));
    return new AuthorName(firstName, von, lastName, []);
}
function getSubStringAsArray(tokens, startIncl, endExcl) {
    var arr = [];
    for (var i = startIncl; i < (endExcl === undefined ? tokens.length : endExcl); i++) {
        arr.push(tokens[i]);
    }
    return arr;
}
function vonLastJrFirst(vonLastStr, jrStr, firstStr) {
    var vonLast = bib_string_utils_1.splitOnPattern(vonLastStr, WHITESPACES);
    var first = bib_string_utils_1.splitOnPattern(firstStr, WHITESPACES);
    var jr = bib_string_utils_1.splitOnPattern(jrStr, WHITESPACES);
    var vonStartInclusive = -1;
    var vonEndExclusive = -1;
    for (var i = 0; i < vonLast.length - 1; i++)
        if (startsWithLowerCaseBSD(vonLast[i])) {
            if (vonStartInclusive < 0)
                vonStartInclusive = i;
            vonEndExclusive = i + 1;
        }
    var von = vonStartInclusive >= 0 ? getSubStringAsArray(vonLast, 0, vonEndExclusive) : [];
    var lastName = getSubStringAsArray(vonLast, Math.max(vonEndExclusive, 0));
    return new AuthorName(first, von, lastName, jr);
}
function parseAuthorName(normalizedFieldValue) {
    var partitions = bib_string_utils_1.splitOnComma(normalizedFieldValue);
    switch (partitions.length) {
        case 1:
            return firstVonLast(partitions[0]);
        case 2:
            return vonLastFirst(mdbsd(partitions[0]), mdbsd(partitions[1]));
        case 3:
            return vonLastJrFirst(mdbsd(partitions[0]), mdbsd(partitions[1]), mdbsd(partitions[2]));
        default:
            throw new Error("Could not parse author name: partitioned as " + JSON.stringify(partitions) + " in " + JSON.stringify(normalizedFieldValue));
    }
}
exports.parseAuthorName = parseAuthorName;
function isdbsd(x) {
    return x !== undefined;
}
function mdbsd(x) {
    if (isdbsd(x))
        return x;
    else
        throw new Error("???????");
}
//# sourceMappingURL=Author.js.map