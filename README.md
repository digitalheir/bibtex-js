# bibtex-js 

Library for parsing BibTeX .bib files, based mostly on the excellent guide to BibTeX, [Tame the BeaST](http://tug.ctan.org/info/bibtex/tamethebeast/ttb_en.pdf). 

Written in Typescript, compiled to ES5 Javascript (with typings provided).

This module literally just parses a BibTex file and processes it **as far as BibTeX goes**. It doesn't process TeX command (i.e., `{\"o}` is not translated to `ö`). If you want to actually work with a bibliography, look for [Bibliography.js](https://github.com/digitalheir/bibliography-js).

Not all internal BibTeX functions are implemented, simply because I don't need them personally. Most notably [sorting entries](https://github.com/digitalheir/bibtex-js/issues/1) is still an open issue because BibTeX has a little complicated algorithm which required a function that "purifies" field values.  

Pull requests and issues are welcome.

## Usage

```js
import {parseBibFile} from "bibtex";

const bibFile = parseBibFile(`

@InProceedings{mut2011,
  author    = {Pradeep Muthukrishnan and Dragomir Radev and Qiaozhu Mei},
  title     = {Simultaneous Similarity Learning and Feature-Weight Learning for Document Clustering},
  booktitle = {Proceedings of TextGraphs-6: Graph-based Methods for Natural Language Processing},
  month     = {June},
  year      = {2011},
  address   = {Portland, Oregon},
  publisher = {Association for Computational Linguistics},
  url       = {http://www.aclweb.org/anthology/W11-1107},
  pages = {42--50}
}
`);

console.log(
    // Keys are case-insensitive
    bibFile.getEntry("MUT2011").getField("TITLE")
); // Prints some complicated string
```

## License
MIT
