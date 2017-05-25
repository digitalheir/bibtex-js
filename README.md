# bibtex-js 

Library for parsing BibTeX .bib files 📚. Provided as pure ES5 Javascript with Typescript typings included.

This module literally just parses a BibTex file and processes it **as far as BibTeX go**. It doesn't process TeX command (i.e., `{\"o}` is not translated to `ö`). If you want to actually work with a bibliography, look for [Bibliography.js](https://github.com/digitalheir/bibliography-js).

Also, many internal BibTeX functions are not implemented yet, simply because I don't need them personally. Pull requests are welcome.

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
); // Some complicated string
```

## License
MIT
