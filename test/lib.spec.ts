import * as assert from "assert";
import "mocha";
import * as nearley from "nearley";
import {grammar} from "../src/parser/ts-parser";
import Lexer from "../src/lexer/Lexer";
import {parseBibFile} from "../src/bibfile/BibFile";

//TODO test crossref?

const COMMENT_PART = "\n\t\nthisisallacommentof{}commentswitheverythingexceptan\", whichweca123nescapewitha0123  ";

//it('should resolve string references like we expect', function () {
//const stringVals = StringValue.resolveStrings(
//  {
//    "mittelbach": {
//      "type": "quotedstringwrapper",
//      "data": [{
//        "type": "quotedstring",
//        "data": [[[{"type": "id", "string": "Mittelbach"}]], [[","]], [[{
//          "type": "ws",
//          "string": " "
//        }]], [[{"type": "id", "string": "Franck"}]]]
//      }]
//    },
//    "acab": {
//      "type": "quotedstringwrapper",
//      "data": [{"stringref": "a"}, {"stringref": "_"}, {"stringref": "c"}, {"stringref": "_"}, {
//        "type": "quotedstring",
//        "data": [[[{"type": "id", "string": "are"}]]]
//      }, {"stringref": "_"}, {"stringref": "b"}]
//    },
//    "c": {
//      "type": "quotedstringwrapper",
//      "data": [{"type": "quotedstring", "data": [[[{"type": "id", "string": "co"}]]]}, {"stringref": "cc"}]
//    },
//    "a": {
//      "type": "quotedstringwrapper",
//      "data": [{
//        "type": "quotedstring",
//        "data": [[[{"type": "id", "string": "a"}]]]
//      }, {"stringref": "l"}, {"stringref": "l"}]
//    },
//    "_": {
//      "type": "quotedstringwrapper",
//      "data": [{"type": "quotedstring", "data": [[[{"type": "ws", "string": " "}]]]}]
//    },
//    "l": {"type": "bracedstringwrapper", "data": ["l"]},
//    "cc": {"type": "bracedstringwrapper", "data": ["mp", {"type": "braced", "data": ["\\", "\"", "u"]}, "ters"]},
//    "b": {
//      "type": "quotedstringwrapper",
//      "data": [{"type": "quotedstring", "data": [[[{"type": "id", "string": "beautifu"}]]]}, {"stringref": "l"}]
//    }
//  }
//);
//console.log(JSON.stringify(withoutRefs));
//});

describe("lexer", () => {
    it("should lex", function () {
        const lexer1 = new Lexer(COMMENT_PART);
        assert.deepEqual(
            lexer1.readTokens(),
            [
                {"type": "ws", "string": "\n\t\n"},
                {"type": "id", "string": "thisisallacommentof"},
                "{",
                "}",
                {"type": "id", "string": "commentswitheverythingexceptan"},
                "\"",
                ",",
                {"type": "ws", "string": " "},
                {"type": "id", "string": "whichweca"},
                123,
                {"type": "id", "string": "nescapewitha"},
                {"type": "number", "string": "0123"},
                {"type": "ws", "string": "  "}
            ]
        );
    });
});


describe("field values", () => {
    it("should handle strings of all shapes", function () {
          const bib = parseBibFile(`@b00k{comp4nion,
                quoted        = "Simple quoted string",
                quotedComplex = "Complex " # " quoted "#" string",
                braced        = {I am a so-called "braced string"},
                bracedComplex = {I {{\am}} a {so-called} {\"b}raced string{\"}.},
                number        = 1993 ,
                naughtyNumber = 1993a,
                naughtString  = abc
            }`);
        assert.deepEqual(
            lexer1.readTokens(),
            [
                {"type": "ws", "string": "\n\t\n"},
                {"type": "id", "string": "thisisallacommentof"},
                "{",
                "}",
                {"type": "id", "string": "commentswitheverythingexceptan"},
                "\"",
                ",",
                {"type": "ws", "string": " "},
                {"type": "id", "string": "whichweca"},
                123,
                {"type": "id", "string": "nescapewitha"},
                {"type": "number", "string": "0123"},
                {"type": "ws", "string": "  "}
            ]
        );
    });
    /* todo implement
    it("should process titles correctly", function () {
          const bib = parseBibFile(`
            This won’t work, since turning it to lower case will produce
            The \latex companion, and LATEX won't accept this...
            @article{lowercased, title = "The \LaTeX Companion"}

            This ensures that switching to lower case will be
            correct. However, applying purify$ gives The 
            Companion. Thus sorting could be wrong;
            @article{wrongsorting1, title = "The {\csname LaTeX\endcsname} {C}ompanion"}

            In this case, { \LaTeX} is not a special character,
            but a set of letters at depth 1. It won’t be modified by change.case$. However, purify$ will
            leave both spaces, and produce The LaTeX Companion, which could result in wrong sorting;
            @article{wrongsorting2, title = "The { \LaTeX} {C}ompanion"}


            @article{works1, title = "The{ \LaTeX} {C}ompanion"}
            @article{works2, title = "The {{\LaTeX}} {C}ompanion"}
            
            For encoding an accent in a title, say É (in upper case) as in the French word École, we’ll write
            {\’{E}}cole, {\’E}cole or {{\’E}}cole, depending on whether we want it to be turned to lower
            case (the first two solutions) or not (the last one). purify$ will give the same result in the three
            cases. However, it should be noticed that the third one is not a special character. If you ask BibTEX
            to extract the first character of each string using text.prefix$, you’ll get {\’{E}} in the first case,
            {\’E} in the second case and {{\}} in the third case.
            
            @article{ecoleLowercased1, title = "{\'{E}}cole"}
            @article{ecoleLowercased2, title = "{\'E}cole"}
            @article{ecoleUppercased, title = "{{\'E}}cole"}
`);*/
        /* todo implement
    it("should process authors correctly", function () {
          const bib = parseBibFile(`
            The first point to notice is that two authors are separated with the keyword and. The format of the
            names is the second important point: The last name first, then the first name, with a separating
            comma. In fact, BibTEX understands other formats

            @article{authors, author = "Goossens, Michel and Mittelbach, Franck and Samarin, Alexander"}
            
            // TODO additional cases in http://tug.ctan.org/info/bibtex/tamethebeast/ttb_en.pdf
`);*/
    // TODO crossref ; additional cases in http://tug.ctan.org/info/bibtex/tamethebeast/ttb_en.pdf
    
    });
});


describe("parser", () => {
    it("should parse comments", function () {
        // const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
        // p.feed(new Lexer(COMMENT_PART).readTokens());
        // const res = p.results;
        // //for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
        // assert.equal(res.length, 1);
        // const parse = res[0];

        const bib = parseBibFile(COMMENT_PART);
        console.log(JSON.stringify(bib));
        assert.equal(bib.entries.length, 0);
        assert.equal(bib.comments.length, 1);
        assert.equal(bib.content.length, 1);
        const firstComment = bib.comments[0].data;
        assert.equal(firstComment[0], "\n\t\n");
        assert.equal(firstComment[9], 123);
        assert.equal(firstComment[11], "0123");
    });

    it("should parse empty", function () {
        assert.equal(parseBibFile("").content.length, 0);
    });

    it("should parse string entries", function () {
        let bib = parseBibFile(`leading comment
            @   STRiNG   {  mittelbach = "Mittelbach, Franck"  }
            @string{acab= a #_# c #_#"are" #_# b}
            @string{c = "co"#cc}
            @string{a = "a"#l#l}
            @string{_ = {{{{{ }}}}}}
            @string{l   =   {l}}    
            @string{cc ={mp{\\"u}ters}}
            @string{b =  "beautifu"#l} `
        );
        console.log(JSON.stringify(bib));
        assert.equal(bib.content.length, 17);

        // assert.equal(bib.entries[0]["data"].key, "mittelbach");

        assert.deepEqual(bib.strings.acab, [
            {"stringref": "a"},
            {"stringref": "_"},
            {"stringref": "c"},
            {"stringref": "_"},
            {"data": ["are"], "type": "quotedstring"},
            {"stringref": "_"},
            {"stringref": "b"}
        ]);
        assert.deepEqual(bib.strings._, [
            {
                "data": [{
                    "data": [{
                        "data": [{
                            "data": [{
                                "string": " ", "type": "ws"
                            }], "type": "braced"
                        }], "type": "braced"
                    }], "type": "braced"
                }], "type": "braced"
            }
        ]);
    });

    it("should parse bib entries", function () {
        const bib = parseBibFile(` @  STRiNG   {  mittelbach = "Mittelbach, Franck" }
            some comment 
            @b00k
            { comp4nion  ,
                auTHor    = "Goossens, jr, Mich{\\\`e}l Frederik and " # mittelbach # " and "#"{ {   A}}le"#"xander de La Samarin ",\n
                titLe     = "The {{\\LaTeX}} {C}{\\"o}mp{\\"a}nion",
            publisher     = "Addison-Wesley",
            yeaR=1993 ,
                Title     = {{Bib}\\TeX},
                title     = {{Bib}\\TeX},
                Title2    = "{Bib}\\TeX",
                Title3    = "{Bib}" # "\\TeX"
            }`);

        assert.equal(bib.content.length, 4);

        console.log(JSON.stringify(bib.content));

        // TODO
        // let bibliography = new Bibliography(parse);
        // bibliography.entries.comp4nion.fields.author._authors.forEach((author) => {
        // });
        // assert.equal(bibliography.strings.mittelbach.toUnicode(), "Mittelbach, Franck");
    });
    it("should parse preamble entries", function () {
        const bib = parseBibFile(`@preamble{ "\\makeatletter" }
@preamble{ "\\@ifundefined{url}{\\def\\url#1{\\texttt{#1}}}{}" }
@preamble{ "\\makeatother" }
`);
        assert.equal(bib.preamble$, "blablabla  123");
    });
});
