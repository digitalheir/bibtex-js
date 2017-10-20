# Bibtex.js

[![npm version](https://badge.fury.io/js/bibtex.svg)](https://www.npmjs.com/package/bibtex)
[![Build Status](https://travis-ci.org/digitalheir/bibtex-js.svg?branch=master)](https://travis-ci.org/digitalheir/bibtex-js)
[![License](https://img.shields.io/npm/l/bibtex.svg)](https://github.com/digitalheir/bibtex-js/blob/master/LICENSE)
[![Code Climate](https://codeclimate.com/github/digitalheir/bibtex-js/badges/gpa.svg)](https://codeclimate.com/github/digitalheir/bibtex-js)


[Live demo in browser](https://digitalheir.github.io/bibtex-js/)

Library for parsing BibTeX .bib files, based mostly on the excellent guide to BibTeX, [*Tame the BeaST*](http://tug.ctan.org/info/bibtex/tamethebeast/ttb_en.pdf). 

Written in Typescript, compiled to ES5 Javascript (with typings provided).

This module literally just parses a BibTex file and processes it **as far as BibTeX goes**. It doesn't process TeX commands (i.e., `{\"o}` is not translated to `ö`). If you want to actually work with a bibliography, look into [Bibliography.js](https://github.com/digitalheir/bibliography-js) or [Citation.js](https://github.com/larsgw/citation.js) or [Zotero](https://github.com/zotero/zotero). If you want to convert LaTeX to Unicode, look into my [latex-to-unicode-converter](https://github.com/digitalheir/latex-to-unicode-converter).

## Implementation
Not all internal BibTeX functions are implemented, simply because I don't need them personally. Most notably [sorting entries is still an open issue](https://github.com/digitalheir/bibtex-js/issues/1) because BibTeX has a little complicated algorithm which required a function that "purifies" field values, which for example makes `{\ss}` equivalent to `ss` but makes `ä` come after `z`. I am unsure if that is actually what anyone wants in modern days though. A modern approach would be to use Unicode collation and then sort.

[Pull requests and issues are welcome.](https://github.com/digitalheir/bibtex-js/issues)

## Usage

Download standalone ES5 file ([latest](https://github.com/digitalheir/bibtex-js/releases/latest)) or get [from npm](https://www.npmjs.com/package/bibtex):

```
npm install bibtex
```

```js
import {parseBibFile} from "bibtex";

const bibFile = parseBibFile(`
          @InProceedings{sci69,
            author    = {Marteen Fredrik Adriaan ding de la Trumppert and مهدي N\\"allen and henQuq, jr, Mathize},
            title     = {You Won't Believe This Proof That {P} \\gtreqqless {NP} Using Super-{T}uring Computation Near Big Black Holes},
            booktitle = {Book of Qeq},
            month     = {September},
            year      = {2001},
            address   = {Dordrecht},
            publisher = {Willems Uitgeverij},
            url       = {https://github.com/digitalheir/},
            pages     = {14--88}
          }
`);


// Keys are case-insensitive
bibFile.getEntry("MUT2011").getField("TITLE"); // This is a complex BibTeX string

console.log(
    // But we can normalize to a JavaScript string
    normalizeFieldValue(fieldValue)
); 
```

## Contact
Maarten Trompper (<maartentrompper@freedom.nl>)

## License
[MIT](https://github.com/digitalheir/bibtex-js/blob/master/LICENSE)
