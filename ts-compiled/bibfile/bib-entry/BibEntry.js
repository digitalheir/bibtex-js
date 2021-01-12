"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Authors_1 = require("./bibliographic-entity/Authors");
var BibStringEntry_1 = require("./BibStringEntry");
var KeyVal_1 = require("../datatype/KeyVal");
var BibEntry = (function () {
    function BibEntry(type, id, fields) {
        this.type = type;
        this._id = id;
        this.fields = fields;
        this.sortkey$ = "";
        this.title$ = "";
    }
    BibEntry.prototype.getField = function (key) {
        return this.fields[key.toLowerCase()];
    };
    BibEntry.prototype.getFieldAsString = function (key) {
        var field = this.getField(key);
        return KeyVal_1.normalizeFieldValue(field);
    };
    BibEntry.prototype.getAuthors = function () {
        var field = this.fields["author"];
        if (field === undefined)
            return field;
        return Authors_1.mustBeAuthors(field);
    };
    return BibEntry;
}());
exports.BibEntry = BibEntry;
function parseEntryFields(fields) {
    var fieldz = {};
    Object.keys(fields).forEach(function (key) {
        switch (key) {
            default:
                fieldz[key] = KeyVal_1.parseFieldValue(fields[key]);
                break;
        }
    });
    return fieldz;
}
exports.parseEntryFields = parseEntryFields;
function isBibEntry(x) {
    return typeof x["type"] === "string"
        && typeof x["_id"] === "string"
        && !!x["fields"];
}
exports.isBibEntry = isBibEntry;
function processEntry(entry, strings$) {
    var processedFields = {};
    var fields$ = entry.fields;
    Object.keys(entry.fields).forEach(function (key) {
        var field$ = BibStringEntry_1.resolveStringReference({}, processedFields, strings$, fields$[key]);
        switch (key) {
            case "author":
                processedFields[key] = new Authors_1.Authors(field$);
                break;
            case "title":
                processedFields[key] = (field$);
                break;
            case "incollection":
            default:
                processedFields[key] = field$;
                break;
        }
    });
    return new BibEntry(entry.type, entry._id, processedFields);
}
exports.processEntry = processEntry;
//# sourceMappingURL=BibEntry.js.map