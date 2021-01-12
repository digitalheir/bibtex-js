"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nearley = require("nearley");
var ts_parser_1 = require("../parser/ts-parser");
var util_1 = require("../util");
var KeyVal_1 = require("./datatype/KeyVal");
var BibEntry_1 = require("./bib-entry/BibEntry");
var BibComment_1 = require("./bib-entry/BibComment");
var BibPreamble_1 = require("./bib-entry/BibPreamble");
var BibStringEntry_1 = require("./bib-entry/BibStringEntry");
var Lexer_1 = require("../lexer/Lexer");
var BibFilePresenter = (function () {
    function BibFilePresenter(content) {
        var _this = this;
        this.content = content;
        this.comments = content.filter(BibComment_1.isBibComment).map(function (c) {
            if (BibComment_1.isBibComment(c))
                return c;
            else
                throw new Error();
        });
        this.preambles_raw = content.filter(function (c) { return BibPreamble_1.isPreamble(c); }).map(function (c) {
            if (BibPreamble_1.isPreamble(c))
                return c;
            else
                throw new Error();
        });
        this.preamble$ = this.preambles_raw.map(function (p) { return p.toString(); }).join("\n");
        var strings = {};
        this.content.forEach(function (entry) {
            if (KeyVal_1.isKeyVal(entry)) {
                if (!!strings[entry.key])
                    throw new Error("String with id " + entry.key + " was defined more than once");
                strings[entry.key] = entry.value;
            }
        });
        this.strings_raw = strings;
        this.strings$ = BibStringEntry_1.resolveStrings(strings);
        this.entries_raw = content.filter(function (c) { return BibEntry_1.isBibEntry(c); }).map(function (c) {
            if (BibEntry_1.isBibEntry(c))
                return c;
            else
                throw new Error();
        });
        var entryMap = {};
        this.entries_raw.forEach(function (entry) {
            var key = entry._id.toLowerCase();
            if (!!entryMap[key])
                throw new Error("Entry with id " + key + " was defined more than once");
            entryMap[key] = BibEntry_1.processEntry(entry, _this.strings$);
        });
        this.entries$ = entryMap;
    }
    BibFilePresenter.prototype.getEntry = function (id) {
        return this.entries$[id.toLowerCase()];
    };
    return BibFilePresenter;
}());
exports.BibFilePresenter = BibFilePresenter;
function parseNonEntry(nonEntry) {
    if (!util_1.isArray(nonEntry.data) || nonEntry.type !== "NON_ENTRY")
        throw new Error();
    return new BibComment_1.BibComment(BibComment_1.flattenPlainText(nonEntry.data));
}
function parseEntry(entry) {
    switch (typeof entry) {
        case "object":
            var data = entry.data;
            if (typeof data["@type"] === "string") {
                return new BibEntry_1.BibEntry(data["@type"], data._id, BibEntry_1.parseEntryFields(data.fields));
            }
            var type = util_1.mustBeString(data.type);
            switch (type) {
                case "string":
                    return BibStringEntry_1.newStringEntry(data);
                case "preamble":
                    return BibPreamble_1.newPreambleNode(data);
                default:
                    throw new Error("Unexpected entry parsed: " + data.type);
            }
        default:
            throw new Error("Expected object as data for entry");
    }
}
exports.parseBibEntriesAndNonEntries = function (parse) {
    return parse.map(function (entity) {
        switch (entity.type) {
            case "NON_ENTRY":
                return (parseNonEntry(entity));
            case "ENTRY":
                return (parseEntry(entity));
            default:
                throw new Error("Expected ENTRY or NON_ENTRY");
        }
    });
};
function parseBibFile(input) {
    var p = new nearley.Parser(ts_parser_1.grammar.ParserRules, ts_parser_1.grammar.ParserStart);
    p.feed(new Lexer_1.default(input).readTokens());
    var res = p.results;
    var parse = res[0];
    return new BibFilePresenter(exports.parseBibEntriesAndNonEntries(parse));
}
exports.parseBibFile = parseBibFile;
//# sourceMappingURL=BibFile.js.map