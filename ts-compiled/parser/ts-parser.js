"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function id(x) {
    return x[0];
}
var isNumber = function (x) {
    return x.constructor === Number || (typeof x === "object" && x.type === "number");
};
var tok_id = {
    test: function (x) {
        return typeof x === "object" && x.type === "id";
    }
};
var entry_type_bib = {
    test: function (x) {
        return typeof x === "object" && x.type === "@bib";
    }
};
var entry_type_string = {
    test: function (x) {
        return typeof x === "object" && x.type === "@string";
    }
};
var entry_type_preamble = {
    test: function (x) {
        return typeof x === "object" && x.type === "@preamble";
    }
};
var entry_type_comment = {
    test: function (x) {
        return typeof x === "object" && x.type === "@comment";
    }
};
var ws = {
    test: function (x) {
        return typeof x === "object" && x.type === "ws";
    }
};
var num = { test: isNumber };
var pound = { literal: "#" };
var eq = { literal: "=" };
var esc = { literal: "\\" };
var paren_l = { literal: "(" };
var paren_r = { literal: ")" };
var brace_l = { literal: "{" };
var brace_r = { literal: "}" };
var quote_dbl = { literal: "\"" };
var comma = { literal: "," };
function addToObj(obj, keyval) {
    if (keyval.type !== "keyval")
        throw new Error("Expected a keyval object");
    var key = keyval.key.toLowerCase();
    if (obj.fields[key]) {
        return;
    }
    else {
        obj.fields[key] = keyval.value;
        return obj;
    }
}
function joinTokens(arr) {
    var strs = [];
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] === "object") {
            if (!arr[i].string)
                throw new Error("Expected token to have a string field called 'string' in object " + JSON.stringify(arr[i]));
            strs.push(arr[i].string);
        }
        else if (typeof arr[i] === "string" || typeof arr[i] === "number") {
            strs.push(arr[i]);
        }
        else
            throw new Error("Could not handle token " + JSON.stringify(arr[i]) + " in array " + JSON.stringify(arr));
    }
    return strs.join("");
}
exports.grammar = {
    Lexer: undefined,
    ParserRules: [
        { "name": "main$ebnf$1", "symbols": ["non_entry"], "postprocess": id },
        {
            "name": "main$ebnf$1", "symbols": [], "postprocess": function () {
                return undefined;
            }
        },
        { "name": "main$ebnf$2", "symbols": [] },
        { "name": "main$ebnf$2$subexpression$1$ebnf$1", "symbols": ["non_entry"], "postprocess": id },
        {
            "name": "main$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function () {
                return undefined;
            }
        },
        { "name": "main$ebnf$2$subexpression$1", "symbols": ["entry", "main$ebnf$2$subexpression$1$ebnf$1"] },
        {
            "name": "main$ebnf$2",
            "symbols": ["main$ebnf$2", "main$ebnf$2$subexpression$1"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        {
            "name": "main",
            "symbols": ["main$ebnf$1", "main$ebnf$2"],
            "postprocess": function (data) {
                var topLevelObjects = [];
                if (data[0])
                    topLevelObjects.push({ type: "NON_ENTRY", data: data[0] });
                for (var i = 0; i < data[1].length; i++) {
                    topLevelObjects.push({ type: "ENTRY", data: data[1][i][0] });
                    if (data[1][i][1])
                        topLevelObjects.push({ type: "NON_ENTRY", data: data[1][i][1] });
                }
                return topLevelObjects;
            }
        },
        { "name": "_$ebnf$1", "symbols": [] },
        {
            "name": "_$ebnf$1", "symbols": ["_$ebnf$1", ws], "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        { "name": "_", "symbols": ["_$ebnf$1"] },
        { "name": "entry_decl$subexpression$1", "symbols": [entry_type_bib] },
        { "name": "entry_decl$subexpression$1", "symbols": [entry_type_string] },
        { "name": "entry_decl$subexpression$1", "symbols": [entry_type_preamble] },
        { "name": "entry_decl$subexpression$1", "symbols": [entry_type_comment] },
        {
            "name": "entry_decl",
            "symbols": ["entry_decl$subexpression$1"],
            "postprocess": function (data) {
                return data[0][0];
            }
        },
        { "name": "entry$subexpression$1", "symbols": ["bib_entry"] },
        { "name": "entry$subexpression$1", "symbols": ["string_entry"] },
        { "name": "entry$subexpression$1", "symbols": ["preamble_entry"] },
        { "name": "entry$subexpression$1", "symbols": ["comment_entry"] },
        {
            "name": "entry", "symbols": ["entry$subexpression$1"], "postprocess": function (data) {
                return data[0][0];
            }
        },
        {
            "name": "comment", "symbols": ["main"], "postprocess": function (data) {
                return data[0];
            }
        },
        { "name": "comment_liberal$ebnf$1", "symbols": [] },
        { "name": "comment_liberal$ebnf$1$subexpression$1", "symbols": [/./] },
        {
            "name": "comment_liberal$ebnf$1",
            "symbols": ["comment_liberal$ebnf$1", "comment_liberal$ebnf$1$subexpression$1"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        {
            "name": "comment_liberal",
            "symbols": ["comment_liberal$ebnf$1"],
            "postprocess": function (data) {
                var toeknz = [];
                for (var tk = 0; tk < data[0].length; tk++)
                    toeknz.push(data[0][tk][0]);
                return toeknz;
            }
        },
        { "name": "entry_body_comment$subexpression$1$macrocall$2", "symbols": ["comment"] },
        {
            "name": "entry_body_comment$subexpression$1$macrocall$1",
            "symbols": [paren_l, "entry_body_comment$subexpression$1$macrocall$2", paren_r],
            "postprocess": function (data) {
                return data[1];
            }
        },
        { "name": "entry_body_comment$subexpression$1", "symbols": ["entry_body_comment$subexpression$1$macrocall$1"] },
        { "name": "entry_body_comment$subexpression$1$macrocall$4", "symbols": ["comment"] },
        {
            "name": "entry_body_comment$subexpression$1$macrocall$3",
            "symbols": [brace_l, "entry_body_comment$subexpression$1$macrocall$4", brace_r],
            "postprocess": function (data) {
                return data[1];
            }
        },
        { "name": "entry_body_comment$subexpression$1", "symbols": ["entry_body_comment$subexpression$1$macrocall$3"] },
        {
            "name": "entry_body_comment",
            "symbols": ["entry_body_comment$subexpression$1"],
            "postprocess": function (data) {
                return data[0][0][0];
            }
        },
        { "name": "entry_body_string$subexpression$1$macrocall$2", "symbols": ["keyval"] },
        {
            "name": "entry_body_string$subexpression$1$macrocall$1",
            "symbols": [paren_l, "_", "entry_body_string$subexpression$1$macrocall$2", "_", paren_r],
            "postprocess": function (data) {
                return data[2];
            }
        },
        { "name": "entry_body_string$subexpression$1", "symbols": ["entry_body_string$subexpression$1$macrocall$1"] },
        { "name": "entry_body_string$subexpression$1$macrocall$4", "symbols": ["keyval"] },
        {
            "name": "entry_body_string$subexpression$1$macrocall$3",
            "symbols": [brace_l, "_", "entry_body_string$subexpression$1$macrocall$4", "_", brace_r],
            "postprocess": function (data) {
                return data[2];
            }
        },
        { "name": "entry_body_string$subexpression$1", "symbols": ["entry_body_string$subexpression$1$macrocall$3"] },
        {
            "name": "entry_body_string",
            "symbols": ["entry_body_string$subexpression$1"],
            "postprocess": function (data) {
                return data[0][0][0];
            }
        },
        { "name": "entry_body_bib$subexpression$1$macrocall$2", "symbols": ["bib_content"] },
        {
            "name": "entry_body_bib$subexpression$1$macrocall$1",
            "symbols": [paren_l, "_", "entry_body_bib$subexpression$1$macrocall$2", "_", paren_r],
            "postprocess": function (data) {
                return data[2];
            }
        },
        { "name": "entry_body_bib$subexpression$1", "symbols": ["entry_body_bib$subexpression$1$macrocall$1"] },
        { "name": "entry_body_bib$subexpression$1$macrocall$4", "symbols": ["bib_content"] },
        {
            "name": "entry_body_bib$subexpression$1$macrocall$3",
            "symbols": [brace_l, "_", "entry_body_bib$subexpression$1$macrocall$4", "_", brace_r],
            "postprocess": function (data) {
                return data[2];
            }
        },
        { "name": "entry_body_bib$subexpression$1", "symbols": ["entry_body_bib$subexpression$1$macrocall$3"] },
        {
            "name": "entry_body_bib",
            "symbols": ["entry_body_bib$subexpression$1"],
            "postprocess": function (data) {
                return data[0][0][0];
            }
        },
        { "name": "bib_content$ebnf$1", "symbols": [] },
        { "name": "bib_content$ebnf$1$subexpression$1", "symbols": ["keyval", "_", comma, "_"] },
        {
            "name": "bib_content$ebnf$1",
            "symbols": ["bib_content$ebnf$1", "bib_content$ebnf$1$subexpression$1"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        { "name": "bib_content$ebnf$2$subexpression$1", "symbols": ["_", comma] },
        { "name": "bib_content$ebnf$2", "symbols": ["bib_content$ebnf$2$subexpression$1"], "postprocess": id },
        {
            "name": "bib_content$ebnf$2", "symbols": [], "postprocess": function () {
                return undefined;
            }
        },
        {
            "name": "bib_content",
            "symbols": ["key_string", "_", comma, "_", "bib_content$ebnf$1", "keyval", "bib_content$ebnf$2"],
            "postprocess": function (data) {
                var obj = {
                    _id: data[0],
                    fields: []
                };
                var keyvals = data[4];
                for (var kv = 0; kv < keyvals.length; kv++) {
                    obj.fields.push(keyvals[kv][0]);
                }
                obj.fields.push(data[5]);
                return obj;
            }
        },
        {
            "name": "bib_entry",
            "symbols": [entry_type_bib, "_", "entry_body_bib"],
            "postprocess": function (data) {
                var obj = {
                    _id: data[2]._id
                };
                obj["@type"] = data[0].string;
                obj.fields = {};
                var keyvals = data[2].fields;
                for (var kv = 0; kv < keyvals.length; kv++) {
                    addToObj(obj, keyvals[kv]);
                }
                return obj;
            }
        },
        {
            "name": "string_entry",
            "symbols": [entry_type_string, "_", "entry_body_string"],
            "postprocess": function (data) {
                return { type: "string", data: data[2] };
            }
        },
        {
            "name": "preamble_entry",
            "symbols": [entry_type_preamble, "_", "entry_body_comment"],
            "postprocess": function (data) {
                return { type: "preamble", data: data[2] };
            }
        },
        {
            "name": "comment_entry",
            "symbols": [entry_type_comment, "_", "entry_body_comment"],
            "postprocess": function (data) {
                return { type: "comment", data: data[2] };
            }
        },
        {
            "name": "keyval",
            "symbols": ["key_string", "_", eq, "_", "value_string"],
            "postprocess": function (data) {
                return { type: "keyval", key: data[0], value: data[4] };
            }
        },
        { "name": "braced_string$ebnf$1", "symbols": [] },
        { "name": "braced_string$ebnf$1$subexpression$1", "symbols": ["non_brace"] },
        { "name": "braced_string$ebnf$1$subexpression$1", "symbols": ["braced_string"] },
        {
            "name": "braced_string$ebnf$1",
            "symbols": ["braced_string$ebnf$1", "braced_string$ebnf$1$subexpression$1"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        {
            "name": "braced_string",
            "symbols": [brace_l, "braced_string$ebnf$1", brace_r],
            "postprocess": function (data) {
                var tkz = [];
                for (var i in data[1])
                    tkz.push(data[1][i][0]);
                return { type: "braced", data: tkz };
            }
        },
        { "name": "quoted_string$ebnf$1", "symbols": [] },
        { "name": "quoted_string$ebnf$1$subexpression$1", "symbols": ["escaped_quote"] },
        { "name": "quoted_string$ebnf$1$subexpression$1", "symbols": ["non_quote_non_brace"] },
        { "name": "quoted_string$ebnf$1$subexpression$1", "symbols": ["braced_string"] },
        {
            "name": "quoted_string$ebnf$1",
            "symbols": ["quoted_string$ebnf$1", "quoted_string$ebnf$1$subexpression$1"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        {
            "name": "quoted_string",
            "symbols": [quote_dbl, "quoted_string$ebnf$1", quote_dbl],
            "postprocess": function (data) {
                var tks = [];
                for (var i in data[1])
                    tks.push(data[1][i][0]);
                return { type: "quotedstring", data: tks };
            }
        },
        { "name": "escaped_quote", "symbols": [esc, quote_dbl] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [tok_id] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [entry_type_bib] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [entry_type_string] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [entry_type_preamble] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [entry_type_comment] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [ws] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [num] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [pound] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [eq] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [esc] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [paren_l] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [paren_r] },
        { "name": "non_quote_non_brace$subexpression$1", "symbols": [comma] },
        { "name": "non_quote_non_brace", "symbols": ["non_quote_non_brace$subexpression$1"] },
        { "name": "key_string$ebnf$1", "symbols": ["stringreftoken"] },
        {
            "name": "key_string$ebnf$1",
            "symbols": ["key_string$ebnf$1", "stringreftoken"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        {
            "name": "key_string", "symbols": ["key_string$ebnf$1"], "postprocess": function (data) {
                return joinTokens(data[0]).toLowerCase();
            }
        },
        { "name": "value_string$subexpression$1$ebnf$1", "symbols": [] },
        {
            "name": "value_string$subexpression$1$ebnf$1$subexpression$1",
            "symbols": ["_", pound, "_", "quoted_string_or_ref"]
        },
        {
            "name": "value_string$subexpression$1$ebnf$1",
            "symbols": ["value_string$subexpression$1$ebnf$1", "value_string$subexpression$1$ebnf$1$subexpression$1"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        {
            "name": "value_string$subexpression$1",
            "symbols": ["quoted_string_or_ref", "value_string$subexpression$1$ebnf$1"]
        },
        { "name": "value_string$subexpression$1", "symbols": ["braced_string"] },
        {
            "name": "value_string",
            "symbols": ["value_string$subexpression$1"],
            "postprocess": function (data) {
                var match = data[0];
                if (match.length === 2) {
                    var tokenz = [];
                    tokenz.push(match[0]);
                    for (var i = 0; i < match[1].length; i++)
                        tokenz.push(match[1][i][3]);
                    return { type: "quotedstringwrapper", data: tokenz };
                }
                else if (match[0].type === "braced")
                    return { type: "bracedstringwrapper", data: match[0].data };
                else
                    throw new Error("Don't know how to handle value " + JSON.stringify(match[0]));
            }
        },
        { "name": "quoted_string_or_ref$subexpression$1", "symbols": ["quoted_string"] },
        { "name": "quoted_string_or_ref$subexpression$1", "symbols": ["string_ref"] },
        { "name": "quoted_string_or_ref$subexpression$1", "symbols": [num] },
        {
            "name": "quoted_string_or_ref",
            "symbols": ["quoted_string_or_ref$subexpression$1"],
            "postprocess": function (data) {
                if (data[0][0].type === "quotedstring")
                    return data[0][0];
                else {
                    return data[0][0];
                }
            }
        },
        { "name": "string_ref$subexpression$1$ebnf$1", "symbols": [] },
        {
            "name": "string_ref$subexpression$1$ebnf$1",
            "symbols": ["string_ref$subexpression$1$ebnf$1", "stringreftoken"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        {
            "name": "string_ref$subexpression$1",
            "symbols": ["stringreftoken_n_num", "string_ref$subexpression$1$ebnf$1"]
        },
        {
            "name": "string_ref",
            "symbols": ["string_ref$subexpression$1"],
            "postprocess": function (data) {
                var str = data[0][0] + joinTokens(data[0][1]);
                return { stringref: str };
            }
        },
        { "name": "stringreftoken$subexpression$1", "symbols": [esc] },
        { "name": "stringreftoken$subexpression$1", "symbols": [paren_l] },
        { "name": "stringreftoken$subexpression$1", "symbols": [paren_r] },
        { "name": "stringreftoken$subexpression$1", "symbols": [tok_id] },
        { "name": "stringreftoken$subexpression$1", "symbols": [num] },
        { "name": "stringreftoken$subexpression$1", "symbols": [entry_type_bib] },
        { "name": "stringreftoken$subexpression$1", "symbols": [entry_type_string] },
        { "name": "stringreftoken$subexpression$1", "symbols": [entry_type_preamble] },
        { "name": "stringreftoken$subexpression$1", "symbols": [entry_type_comment] },
        {
            "name": "stringreftoken",
            "symbols": ["stringreftoken$subexpression$1"],
            "postprocess": function (data) {
                if (typeof data[0][0] === "object") {
                    if (!data[0][0].string)
                        throw new Error("Expected " + data[0] + "to have a 'string' field");
                    return data[0][0].string;
                }
                else {
                    if ((!(typeof data[0][0] === "string" || typeof data[0][0] === "number")))
                        throw new Error("Expected " + data[0][0] + " to be a string");
                    return data[0][0];
                }
            }
        },
        { "name": "stringreftoken_n_num$subexpression$1", "symbols": [esc] },
        { "name": "stringreftoken_n_num$subexpression$1", "symbols": [paren_l] },
        { "name": "stringreftoken_n_num$subexpression$1", "symbols": [paren_r] },
        { "name": "stringreftoken_n_num$subexpression$1", "symbols": [tok_id] },
        { "name": "stringreftoken_n_num$subexpression$1", "symbols": [entry_type_bib] },
        { "name": "stringreftoken_n_num$subexpression$1", "symbols": [entry_type_string] },
        { "name": "stringreftoken_n_num$subexpression$1", "symbols": [entry_type_preamble] },
        { "name": "stringreftoken_n_num$subexpression$1", "symbols": [entry_type_comment] },
        {
            "name": "stringreftoken_n_num",
            "symbols": ["stringreftoken_n_num$subexpression$1"],
            "postprocess": function (data) {
                if (typeof data[0][0] === "object") {
                    if (!data[0][0].string)
                        throw new Error("Expected " + data[0] + "to have a 'string' field");
                    return data[0][0].string;
                }
                else {
                    if ((!(typeof data[0][0] === "string" || typeof data[0][0] === "number")))
                        throw new Error("Expected " + data[0][0] + " to be a string");
                    return data[0][0];
                }
            }
        },
        { "name": "non_brace$subexpression$1", "symbols": [esc] },
        { "name": "non_brace$subexpression$1", "symbols": [paren_l] },
        { "name": "non_brace$subexpression$1", "symbols": [paren_r] },
        { "name": "non_brace$subexpression$1", "symbols": [tok_id] },
        { "name": "non_brace$subexpression$1", "symbols": [quote_dbl] },
        { "name": "non_brace$subexpression$1", "symbols": [ws] },
        { "name": "non_brace$subexpression$1", "symbols": [num] },
        { "name": "non_brace$subexpression$1", "symbols": [comma] },
        { "name": "non_brace$subexpression$1", "symbols": [entry_type_bib] },
        { "name": "non_brace$subexpression$1", "symbols": [entry_type_string] },
        { "name": "non_brace$subexpression$1", "symbols": [entry_type_preamble] },
        { "name": "non_brace$subexpression$1", "symbols": [entry_type_comment] },
        { "name": "non_brace$subexpression$1", "symbols": [pound] },
        { "name": "non_brace$subexpression$1", "symbols": [eq] },
        {
            "name": "non_brace",
            "symbols": ["non_brace$subexpression$1"],
            "postprocess": function (data) {
                return data[0][0];
            }
        },
        { "name": "non_bracket$subexpression$1", "symbols": [esc] },
        { "name": "non_bracket$subexpression$1", "symbols": [tok_id] },
        { "name": "non_bracket$subexpression$1", "symbols": [quote_dbl] },
        { "name": "non_bracket$subexpression$1", "symbols": [ws] },
        { "name": "non_bracket$subexpression$1", "symbols": [num] },
        { "name": "non_bracket$subexpression$1", "symbols": [comma] },
        { "name": "non_bracket$subexpression$1", "symbols": [entry_type_bib] },
        { "name": "non_bracket$subexpression$1", "symbols": [entry_type_string] },
        { "name": "non_bracket$subexpression$1", "symbols": [entry_type_preamble] },
        { "name": "non_bracket$subexpression$1", "symbols": [entry_type_comment] },
        { "name": "non_bracket$subexpression$1", "symbols": [pound] },
        { "name": "non_bracket$subexpression$1", "symbols": [eq] },
        {
            "name": "non_bracket",
            "symbols": ["non_bracket$subexpression$1"],
            "postprocess": function (data) {
                return data[0][0];
            }
        },
        { "name": "non_entry$ebnf$1$subexpression$1", "symbols": ["escaped_entry"] },
        { "name": "non_entry$ebnf$1$subexpression$1", "symbols": ["escaped_escape"] },
        { "name": "non_entry$ebnf$1$subexpression$1", "symbols": ["escaped_non_esc_outside_entry"] },
        { "name": "non_entry$ebnf$1$subexpression$1", "symbols": ["non_esc_outside_entry"] },
        { "name": "non_entry$ebnf$1", "symbols": ["non_entry$ebnf$1$subexpression$1"] },
        { "name": "non_entry$ebnf$1$subexpression$2", "symbols": ["escaped_entry"] },
        { "name": "non_entry$ebnf$1$subexpression$2", "symbols": ["escaped_escape"] },
        { "name": "non_entry$ebnf$1$subexpression$2", "symbols": ["escaped_non_esc_outside_entry"] },
        { "name": "non_entry$ebnf$1$subexpression$2", "symbols": ["non_esc_outside_entry"] },
        {
            "name": "non_entry$ebnf$1",
            "symbols": ["non_entry$ebnf$1", "non_entry$ebnf$1$subexpression$2"],
            "postprocess": function arrpush(d) {
                return d[0].concat([d[1]]);
            }
        },
        {
            "name": "non_entry", "symbols": ["non_entry$ebnf$1"], "postprocess": function (data) {
                var tokens = [];
                for (var Ti = 0; Ti < data[0].length; Ti++)
                    tokens.push(data[0][Ti][0]);
                return tokens;
            }
        },
        {
            "name": "escaped_escape", "symbols": [esc, esc], "postprocess": function () {
                return "\\";
            }
        },
        {
            "name": "escaped_entry", "symbols": [esc, "entry_decl"], "postprocess": function (data) {
                return { type: "escapedEntry", data: data[1] };
            }
        },
        {
            "name": "escaped_non_esc_outside_entry",
            "symbols": [esc, "non_esc_outside_entry"],
            "postprocess": function (data) {
                return data;
            }
        },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [tok_id] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [ws] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [num] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [pound] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [eq] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [paren_l] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [paren_r] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [brace_l] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [brace_r] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [quote_dbl] },
        { "name": "non_esc_outside_entry$subexpression$1", "symbols": [comma] },
        {
            "name": "non_esc_outside_entry",
            "symbols": ["non_esc_outside_entry$subexpression$1"],
            "postprocess": function (data) {
                return data[0][0];
            }
        }
    ],
    ParserStart: "main"
};
//# sourceMappingURL=ts-parser.js.map