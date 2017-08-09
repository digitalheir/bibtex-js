import "mocha";

import {expect} from "chai";
import {parseBibFile} from "../src/bibfile/BibFile";
import {isOuterQuotedString, OuterQuotedString, QuotedString} from "../src/bibfile/datatype/string/QuotedString";
import {isNumber, mustBeArray, mustBeDefined} from "../src/util";
import {BibEntry, EntryFields} from "../src/bibfile/bib-entry/BibEntry";
import {determineAuthorNames$, mustBeAuthors} from "../src/bibfile/bib-entry/bibliographic-entity/Authors";
import {BracedString} from "../src/bibfile/datatype/string/BracedString";
import Lexer from "../src/lexer/Lexer";
import {BibStringData} from "../src/bibfile/datatype/string/BibStringData";
import {
    flattenQuotedStrings, splitOnComma, splitOnPattern,
    toStringBibStringData
} from "../src/bibfile/datatype/string/bib-string-utils";
import {FieldValue} from "../src/bibfile/datatype/KeyVal";
import {parseAuthorName} from "../src/bibfile/bib-entry/bibliographic-entity/Author";

// TODO test crossref?


describe("Author: von Last, First", () => {
    it("von Last, First", function () {
        const authorName = parseAuthorName(["Von De la ", "Last", ",", "firstName= ", "."]);
        expect(authorName.vons$[1].indexOf("De")).to.greaterThan(-1);
        expect(authorName.lastNames$[0].indexOf("Last")).to.greaterThan(-1);
        expect(authorName.jrs$).to.deep.equal([]);
        expect(authorName.firstNames$[0].indexOf("firstName=")).to.greaterThan(-1);
    });

    // NOTE: This case raises an error message from BibTEX, complaining that a name ends with a comma. It is a common error to separate names with commas instead of “and”
    it("jean de la fontaine,", function () {
        const authorName = parseAuthorName(["jean de la fontaine,"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("jean de la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("de la fontaine, Jean", function () {
        const authorName = parseAuthorName(["de la fontaine, Jean"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("de la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("De La Fontaine, Jean", function () {
        const authorName = parseAuthorName(["De La Fontaine, Jean"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("De La Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("De la Fontaine, Jean", function () {
        const authorName = parseAuthorName(["De la Fontaine, Jean"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("De la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("de La Fontaine, Jean", function () {
        const authorName = parseAuthorName(["de La Fontaine, Jean"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("de");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("La Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

});
describe("Author: von Last, Jr, First", () => {


    // NOTE: This case raises an error message from BibTEX, complaining that a name ends with a comma. It is a common error to separate names with commas instead of “and”
    it("jean de la fontaine,", function () {
        const authorName = parseAuthorName(["jean de la fontaine,,"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("jean de la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });
    it("de la fontaine, Jr., Jean", function () {
        const authorName = parseAuthorName(["de la fontaine, Jr., Jean"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("de la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("Jr.");
    });

    it("De La Fontaine, Jr., Jean", function () {
        const authorName = parseAuthorName(["De La Fontaine, Jr., Jean"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("De La Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("Jr.");
    });

    it("De la Fontaine, Jr., Jean", function () {
        const authorName = parseAuthorName(["De la Fontaine, Jr., Jean"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("De la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("Jr.");
    });

    it("de La Fontaine, Jr., Jean", function () {
        const authorName = parseAuthorName(["de La Fontaine, Jr., Jean"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("de");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("La Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("Jr.");
    });
    it("von Last, Jr., First", function () {
        const authorName = parseAuthorName(["von ", "Last", ", Jr.", ",", "firstName, ", ".,,,etc,,"])
        expect(authorName.vons$[0].indexOf("von")).to.greaterThan(-1);
        expect(authorName.lastNames$[0].indexOf("Last")).to.greaterThan(-1);
        expect(authorName.jrs$[0].indexOf("Jr.")).to.greaterThan(-1);
        expect(authorName.firstNames$[0].indexOf("firstName,")).to.greaterThan(-1);
    });


});
describe("Author: First von Last", () => {
    it("First von Last", function () {
        const authorName = parseAuthorName(["First von Last"]);
        expect(authorName.vons$[0].indexOf("von")).to.greaterThan(-1);
        expect(authorName.lastNames$[0].indexOf("Last")).to.greaterThan(-1);
        expect(authorName.jrs$.length).to.equal(0);
        expect(authorName.firstNames$[0].indexOf("First")).to.greaterThan(-1);
    });

    it("jean de la fontaine", function () {
        const authorName = parseAuthorName(["jean de la fontaine"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("jean de la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("Jean de la fontaine", function () {
        const authorName = parseAuthorName(["Jean de la fontaine"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("de la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("Jean {de} la fontaine", function () {
        const authorName = parseAuthorName(["Jean ", new BracedString(0, ["de"]), " la fontaine"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean de");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("jean {de} {la} fontaine", function () {
        const authorName = parseAuthorName(["jean ", new BracedString(0, ["de"]), " ",
            new BracedString(0, ["la"]), " fontaine"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("jean");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("de la fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("Jean {de} {la} fontaine", function () {
        const authorName = parseAuthorName(["Jean ", new BracedString(0, ["de"]), " ",
            new BracedString(0, ["la"]), " fontaine"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean de la");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("Jean De La Fontaine", function () {
        const authorName = parseAuthorName(["Jean De La Fontaine"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean De La");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("jean De la Fontaine", function () {
        const authorName = parseAuthorName(["jean De la Fontaine"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("jean De la");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

    it("Jean de La Fontaine", function () {
        const authorName = parseAuthorName(["Jean de La Fontaine"]);
        expect(authorName.firstNames$.map(toStringBibStringData).join(" ")).to.eq("Jean");
        expect(authorName.vons$.map(toStringBibStringData).join(" ")).to.eq("de");
        expect(authorName.lastNames$.map(toStringBibStringData).join(" ")).to.eq("La Fontaine");
        expect(authorName.jrs$.map(toStringBibStringData).join(" ")).to.eq("");
    });

});
describe("utils", () => {
    it("split on pattern", function () {
        expect(
            splitOnPattern(
                ["xx", "xx", "endfirst xxx startsecond", "  xxx xxx xxx3", "xxx xxx", "midxxxEOF"],
                /\s*xxx\s*/g,
                3
            )
        ).to.deep.equal(
            [
                [
                    "xx",
                    "xx",
                    "endfirst"
                ],
                [
                    "startsecond",
                    ""
                ],
                [
                    ""
                ],
                [
                    "xxx3",
                    "xxx xxx",
                    "midxxxEOF"
                ],
            ]
        );
    });
    it("split on pattern", function () {
        expect(
            splitOnPattern(["xx", "xx", "xx"], /\s*xxx\s*/g, 3)
        ).to.deep.equal(
            [["xx", "xx", "xx"]]
        );
    });

    it("split on ,", function () {
        expect(
            splitOnComma(["von ", "Last", ", ", "name, ", "Jr.,,,etc,,"], 3)
        ).to.deep.equal(
            [
                [
                    "von ",
                    "Last",
                    ""
                ],
                [
                    "name"
                ],
                [
                    "Jr."
                ],
                [
                    ",,etc,,"
                ]
            ]
        );
    });
});


describe("lexer", () => {
    it("should lex", function () {
        const lexer1 = new Lexer("\n\t\nthisisallacommentof{}commentswitheverythingexceptan\", whichweca123nescapewitha0123  ");
        expect(
            lexer1.readTokens()
        ).to.deep.equal([
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
        const bib = parseBibFile(`
             @string{  abc = "def" }
             @b00k{comp4nion,
                quoted        = "Simple quoted string",
                quotedComplex = "Complex " # quoted #" string",
                braced        = {I am a so-called "braced string09 11"},
                bracedComplex = {I {{\\am}} a {so-called} {\\"b}raced string{\\"}.},
                number        = 911 ,
                naughtyNumber = a911a,
                a911a         = {a911a},
                naughtyString = abc
            }
             @string{  quoted = " referenced" }
             @string{  a911a = {b911c} }
            `);

        expect(bib.entries$.comp4nion.getField("quoted")).to.deep.equal(new OuterQuotedString([
            new QuotedString(0, [
                "Simple", " ", "quoted", " ", "string"
            ])
        ]));

        // TODO
        // expect(bib.entries$.comp4nion.getField("quotedCOMPLEX")).to.deep.equal(
        //     {
        //         "type": "quotedstringwrapper",
        //         "braceDepth": 0,
        //         "data": [{"type": "quotedstring", "braceDepth": 0, "data": ["Complex", " "]}, {
        //             "braceDepth": 0,
        //             "stringref": "quoted"
        //         }, {"type": "quotedstring", "braceDepth": 0, "data": [" ", "string"]}]
        //     }
        // );
        // expect(bib.entries$.comp4nion.getField("braced")).to.deep.equal(
        //     {
        //         "type": "bracedstringwrapper",
        //         "braceDepth": 0,
        //         "data": [
        //             "I", " ", "am", " ", "a", " ", "so-called", " ",
        //             "\"", "braced", " ", "string", "09", " ", 11, "\""
        //         ]
        //     }
        // );
        const bracedComplex: any = bib.entries$.comp4nion.getField("bracedCOMPLEX");
        expect(bracedComplex.type).to.equal("bracedstringwrapper");
        const bracedComplexData = bracedComplex.data;
        const bracedComplexDatum0: any = bracedComplexData[0];
        const bracedComplexDatum2: any = bracedComplexData[2];
        expect(bracedComplexDatum0).to.equal("I");
        const bracedComplexDatum2Data: any = bracedComplexDatum2.data;
        const bracedComplexDatum2Datum0: any = bracedComplexDatum2Data[0];
        expect(bracedComplexDatum2Datum0.braceDepth).to.equal(1);

        const numberField = bib.entries$.comp4nion.getField("number");
        expect(numberField).to.equal(911);

        const naughtyNumber: any = mustBeDefined(bib.entries$.comp4nion.getField("naughtyNumber"));
        const t: any = naughtyNumber["type"];
        const nnData: any[] = mustBeArray(naughtyNumber["data"]);

        expect(t).to.equal("quotedstringwrapper");
    });

    it("should tease apart author names", function () {
        function qs(data: BibStringData): QuotedString {
            return new QuotedString(0, data);
        }

        function bs(data: BibStringData): QuotedString {
            return new BracedString(0, data);
        }

        expect(determineAuthorNames$(new OuterQuotedString([1]))).to.deep.equal([["1"]]);
        expect(determineAuthorNames$(new OuterQuotedString(
            [1, qs([" a"]), "n", "d", qs([" "]), bs(["\\", "two"])]
        ))).to.deep.equal([["1"], [{
            "braceDepth": 0,
            "data": [
                "\\",
                "two"
            ],
            "isSpecialCharacter": true,
            "type": "bracedstring"
        }]]);
    });

    it("should determine author names", function () {
        const bib = parseBibFile(` @  STRiNG   {  mittelbach = "Mittelbach, Franck" }
            some comment
            @b00k
            { comp4nion  ,
                auTHor    = "Goossens, jr, Mich{\\\`e}l Frederik and " # mittelbach # " and "#"{ {   A}}le"#"xander de La Samarin ",\n
            }`);

        const book: BibEntry = mustBeDefined(bib.getEntry("COMP4NION"));
        console.log(
            mustBeDefined(book.getAuthors()).authors$
        );
    });

    it("should flatten quoted strings", function () {
        const bib = parseBibFile(`
            @string { quoted = "QUO" # "TED" }
            @string { braced = {"quoted"} }
            @a{b,
                bracedComplex = {I {{\\am}} {\\"a} "so-"called"" braced string{\\"}.},
                quotedComplex = "and I {"} am a {"} " # quoted # " or "#braced#"string ",
                number        = 911,
            }`);
        // stringref     = abc
        const a: BibEntry = bib.entries$.b;
        const fields$: EntryFields = a.fields;
        const bracedcomplex: FieldValue = fields$.bracedcomplex;
        if (isNumber(bracedcomplex)) throw Error();
        console.log(flattenQuotedStrings(bracedcomplex.data, true));

        const quotedComplex: FieldValue = fields$.quotedcomplex;
        if (isNumber(quotedComplex)) throw Error();
        console.log(flattenQuotedStrings(quotedComplex.data, true));

        const nineEleven: FieldValue = fields$.number;
        expect(nineEleven).to.equal(911);
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

    // });
});


describe("parser", () => {
    it("should parse comments", function () {
        const bib = parseBibFile("\n\t\nthisisallacommentof{}commentswitheverythingexceptan\", whichweca123nescapewitha0123  ");
        console.log(JSON.stringify(bib));
        expect(bib.entries_raw.length).to.equal(0);
        expect(bib.comments.length).to.equal(1);
        expect(bib.content.length).to.equal(1);
        const firstComment = bib.comments[0].data;
        expect(firstComment[0]).to.equal("\n\t\n");
        expect(firstComment[9]).to.equal("123");
        expect(firstComment[11]).to.equal("0123");
    });

    it("should parse empty", function () {
        expect(parseBibFile("").content.length).to.equal(0);
    });

    it("should throw for cyclic string entries", function () {
        let thrown = false;
        try {
            parseBibFile(
                `@string{c = "a"#b}
        @string{b = "b"#a}`
            );
        } catch (e) {
            thrown = true;
        }
        expect(thrown).to.equal(true);
    });
    it("should parse string entries", function () {
        const bib = parseBibFile(`leading comment
            @   STRiNG   {  mittelbach = "Mittelbach, Franck"  }
            @string{acab= a #_# c #_#"are" #_# b}
            @string{c = "co"#cc}
            @string{a = "a"#l#l}
            @string{_ = {{{{{ }}}}}}
            @string{l   =   {l}}
            @string{cc ={mp{\\"u}ters}}
            @string{b =  "beautifu"#l} `
        );
        expect(bib.content.length).to.equal(17);

        // expect(bib.entries[0]["data"].key).to.equal("mittelbach");

        const acab = bib.strings_raw.acab;
        if (isOuterQuotedString(acab)) {
            const thirdDatum: any = acab.data[3];
            expect(thirdDatum.stringref).to.equal("_");
            const fourthDatum: any = acab.data[4];
            expect(fourthDatum["type"]).to.equal("quotedstring");
        } else
            expect(isOuterQuotedString(acab)).to.throw();

        const acab$ = bib.strings$.acab;
        if (isOuterQuotedString(acab$)) {
            const thirdDatum: any = acab$.data[3];
            expect(thirdDatum.type).to.equal("bracedstringwrapper");
            const fourthDatum: any = acab$.data[4];
            expect(fourthDatum["type"]).to.equal("quotedstring");
        } else
            expect(isOuterQuotedString(acab$)).to.throw();
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

        expect(bib.content.length).to.equal(4);

        console.log(JSON.stringify(bib.content));

        const entry: BibEntry = mustBeDefined(bib.getEntry("Comp4nion"));

        const authors = mustBeAuthors(mustBeDefined(entry.getField("author")));
        expect(authors).to.not.be.null;
        expect(authors.authors$.length).to.eq(3);

        console.log(authors.authors$);
    });

    it("should parse preamble entries", function () {
        const bib = parseBibFile(`@preamble{ "\\@ifundefined{url}{\\def\\url#1{\\texttt{#1}}}{}" }
                                  @preamble{ "\\makeatletter" }
                                  @preamble{ "\\makeatother" }
`);
        expect(bib.preamble$, ` "\\@ifundefined{url}{\\def\\url#1{\\texttt{#1}}}{}"
 "\\makeatletter"
 "\\makeatother" `);
    });
});
