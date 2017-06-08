# LaTeX parser core modules

This is a set of libraries designed to build abstract syntax trees for LaTeX documents using JavaScript.

This is a TypeScript fork of the [**TeXnous project**](http://texnous.org). The original source code has been ported to TypeScript, and is compiled to a minified ES5 UMD module for use in Node and in the browser.

Implemented functionality requires LaTeX symbols, commands and environments contained in analyzed files to be described and provided to the parser object.