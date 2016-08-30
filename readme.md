# LaTeX parser core modules
This file is a part of [**TeXnous project**](http://texnous.com).

This is a set of libraries designed to build abstract syntax trees for LaTeX documents using JavaScript.
Implemented functionality requires LaTeX symbols, commands and environments contained in analyzed files to be described and provided to the parser object.

[TOC]

## The structure of the repository
There are several files for the meta purposes:

- **package.json** describes the repository npm framework including dependencies.
- **license.gpl-3.0.md** and **license.lgpl-3.0.md** contain the full texts of the licenses.
- **.babelrc** sets the rules for the babel utility.
- **readme.md** is this description.

And there are three directories:

- **sources** contains handwritten source code. It uses some of the ECMAScript 6 features, so it is compiled for better compatibility.
- **deploy** contains the source code compiled to ECMAScript 5. These files are intended for the external use.
- **tests** contains unit tests for the deployment files.

The content of these directories is arranged exactly the same way, files with the same relative paths correspond to each other.

- **lib** is the directory with libraries implementing all logic
	- **Latex.js** contains general definitions.
	- **LatexStyle.js** describes style structures.
	- **SyntaxTree.js** encapsulates abstract syntax tree class.
	- **LatexTree.js** extends it with LaTeX syntax tree features.
	- **LatexParser.js** provides methods to build LatexTree objects for files **.tex**.
- **main.js** is the main exported file to get access the libraries.

## ECMAScript 6 to ECMAScript 5 compilation settings
As was already mentioned, the source code is converted to the ECMAScript 5 standard for better compatibility. For this purpose, [babel](http://babeljs.io/) tool is used.

### WebStorm
The general method of a babel file watcher setting can be found at the [JetBrains website](https://blog.jetbrains.com/webstorm/2015/05/ecmascript-6-in-webstorm-transpiling/). Here are the settings used in this project:

- **File type:** `JavaScript`
- **Scope:** `Sources`
- **Program:** `$ProjectFileDir$/node_modules/.bin/babel`
- **Arguments:** `$FileDirRelativeToProjectRoot$ --source-maps --out-dir deploy/$FileDirPathFromParent(sources)$`
- **Working directory:** `$ProjectFileDir$`
- **Output paths to refresh:** `deploy`
