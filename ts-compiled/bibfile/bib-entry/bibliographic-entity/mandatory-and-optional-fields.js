"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
exports.address = "address";
exports.author = "author";
exports.booktitle = "booktitle";
exports.chapter = "chapter";
exports.edition = "edition";
exports.editor = "editor";
exports.howpublished = "howpublished";
exports.institution = "institution";
exports.journal = "journal";
exports.month = "month";
exports.note = "note";
exports.number = "number";
exports.organization = "organization";
exports.pages = "pages";
exports.publisher = "publisher";
exports.school = "school";
exports.series = "series";
exports.title = "title";
exports.type = "type";
exports.volume = "volume";
exports.year = "year";
exports.optionalFields = {
    "book": [["volume", "number"], "series", "address", "edition", "month", "note"],
    "booklet": ["author", "howpublished", "address", "address", "month", "year", "note"],
    "conference": ["editor", ["volume", "number"], "series", "pages", "address", "month", "organization", "publisher", "note"],
    "inproceedings": ["editor", ["volume", "number"], exports.series, "pages", "address", "month", "organization", "publisher", "note"],
    "inbook": ["volume", "number", "series", "type", "address", "edition", "month", "note"],
    "incollection": ["editor", ["volume", "number"], "series", "type", "chapter", "pages", "address", "edition", "month", "note"],
    "manual": ["author", "organization", "year", "address", "edition", "month", "note"],
    "mastersthesis": ["type", "address", "month", "note"],
    "misc": [],
    "phdthesis": ["type", "address", "month", "note"],
    "proceedings": ["editor", ["volume", "number"], "series", "address", "month", "organization", "publisher", "note"],
    "techreport": ["type", "address", "number", "month", "note"],
    "unpublished": ["month", "year"]
};
exports.mandatoryFields = {
    "article": ["author", "title", "year", "journal"],
    "book": [["author", "editor"], "title", "publisher", "year"],
    "booklet": ["title"],
    "conference": ["author", "title", "booktitle", "year"],
    "inproceedings": ["author", "title", "booktitle", "year"],
    "inbook": [["author", "editor"], "title", ["chapter", "pages"]],
    "incollection": ["author", "title", "booktitle", "publisher", "year"],
    "manual": ["title"],
    "mastersthesis": ["author", "title", "school", "year"],
    "misc": [["author", "title", "howpublished", "year", "month", "note"]],
    "phdthesis": ["author", "title", "school", "year"],
    "proceedings": ["year", "title"],
    "techreport": ["author", "title", "institution", "year"],
    "unpublished": ["author", "title", "note"]
};
function hasOptionalFields(s) {
    return exports.optionalFields.hasOwnProperty(s);
}
exports.hasOptionalFields = hasOptionalFields;
function hasMandatoryFields(s) {
    return exports.mandatoryFields.hasOwnProperty(s);
}
exports.hasMandatoryFields = hasMandatoryFields;
function getMandatoryFields(s) {
    if (hasMandatoryFields(s)) {
        return exports.mandatoryFields[s];
    }
    else {
        return [];
    }
}
exports.getMandatoryFields = getMandatoryFields;
function getOptionalFields(s) {
    if (hasOptionalFields(s)) {
        return exports.optionalFields[s];
    }
    else {
        return [];
    }
}
exports.getOptionalFields = getOptionalFields;
exports.findError = function (entry, field) {
    var fields = entry.fields;
    if (util_1.isString(field)) {
        if (!fields[field])
            return new Error("Warning: expected " + entry.type + " with id " + entry._id
                + " to have the field: " + field);
    }
    else if (util_1.isArray(field)) {
        var hasAllFields = field.reduce(function (acc, fieldName) {
            if (util_1.isString(fieldName)) {
                return (acc && fields.hasOwnProperty(fieldName));
            }
            else
                throw new Error();
        }, true);
        if (!hasAllFields) {
            return new Error("Expected " + entry.type + " with id " + entry._id
                + " to have one of the following fields: " + field);
        }
    }
};
//# sourceMappingURL=mandatory-and-optional-fields.js.map