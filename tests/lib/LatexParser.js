/**
 * @fileoverview  LaTeX parser class tests
 * This file is a part of TeXnous project.
 *
 * @copyright TeXnous project team (http://texnous.com) 2016
 * @license LGPL-3.0
 *
 * This unit test is free software; you can redistribute it and/or modify it under the terms of the
 * GNU Lesser General Public License as published by the Free Software Foundation; either version 3
 * of the License, or (at your option) any later version.
 *
 * This unit test is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this unit
 * test; if not, write to the Free Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA.
 */

'use strict';

/** @external LatexStyle */
const LatexStyle = require('../../deploy/lib/LatexStyle'); // LaTeX style structures
/** @external LatexParser */
const LatexParser =  require('../../deploy/lib/LatexParser'); // LaTeX parser class


let latexStyle = new LatexStyle();
//noinspection JSUnresolvedFunction
latexStyle.loadPackage('test', {
  symbols: [{
    pattern: '\\\\'
  }],
  commands: [{
    name: 'author',
    pattern: '[#1]#2',
    modes: { TEXT: true },
    parameters: [{}, {}],
    operations: []
  }, {
    name: 'author',
    pattern: ' [#1]#2',
    modes: { TEXT: true },
    parameters: [{}, {}],
    operations: []
  }, {
    name: 'author',
    pattern: '#1',
    modes: { TEXT: true },
    parameters: [{}],
    operations: []
  }, {
    name: 'document',
    modes: { TEXT: true }
  }, {
    name: 'enddocument',
    modes: { TEXT: true }
  }],
  environments: [{
    name: 'document',
    modes: { TEXT: true }
  }]
});
let latexParser;


module.exports = {
  /**
   * LaTeX parser object constructor test
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  'constructor': function (test) {
    test.doesNotThrow(function () { latexParser = new LatexParser(latexStyle) });
    test.done();
  },
  /**
   * Spaces and analogs handling tests
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  'parse spaces': function (test) {
    test.equal(latexParser.parse('').join(''), '');
    test.equal(latexParser.parse('% comment\n % comment').join(''), '');
    test.equal(latexParser.parse(' ').join('\n'), 'LatexTree.SpaceToken{ }');
    test.equal(latexParser.parse(' % comment\n ').join(''), 'LatexTree.SpaceToken{ }');
    test.equal(latexParser.parse('\t% comment\n ').join(''), 'LatexTree.SpaceToken{ }');
    test.equal(latexParser.parse('\t% comment\n\n').join(''), 'LatexTree.SpaceToken{\n}');
    test.equal(latexParser.parse('\n % comment\n\n').join(''), 'LatexTree.SpaceToken{\n\n}');
    test.equal(latexParser.parse('\n % comment\n\n  % comment\n\n').join(''), 'LatexTree.SpaceToken{\n\n}');
    test.done();
  },
  /**
   * LaTeX symbols handling tests
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  'parse symbols': function (test) {
    test.equal(latexParser.parse('%\n\\\\%\n').join(''), 'LatexTree.SymbolToken{\\\\}');
    test.equal(latexParser.parse(' \\\\').join(''), 'LatexTree.SpaceToken{ }LatexTree.SymbolToken{\\\\}');
    test.equal(latexParser.parse('\\\\ ').join(''), 'LatexTree.SymbolToken{\\\\}LatexTree.SpaceToken{ }');
    test.equal(latexParser.parse('\\\\\\\\').join(''), 'LatexTree.SymbolToken{\\\\}LatexTree.SymbolToken{\\\\}');
    test.equal(latexParser.parse('"%\n').join(''), 'LatexTree.SymbolToken[?]{"}');
    test.equal(latexParser.parse('\\\\"').join(''), 'LatexTree.SymbolToken{\\\\}LatexTree.SymbolToken[?]{"}');
    test.equal(latexParser.parse('%\n"\\\\').join(''), 'LatexTree.SymbolToken[?]{"}LatexTree.SymbolToken{\\\\}');
    test.equal(latexParser.parse('"%\n"').join(''), 'LatexTree.SymbolToken[?]{"}LatexTree.SymbolToken[?]{"}');
    test.done();
  },
  /**
   * LaTeX commands handling tests
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  'parse commands': function (test) {
    test.equal(latexParser.parse('\\author{Name}').join(''), 'LatexTree.CommandToken{\\author{Name}}');
    test.equal(latexParser.parse('\\author [Opt Name] {Name}').join(''),
      'LatexTree.CommandToken{\\author [Opt Name] {Name}}');
    test.equal(latexParser.parse('\\author[{Opt Name}] {Name}').join(''),
      'LatexTree.CommandToken{\\author[{Opt Name}] {Name}}');
    test.done();
  },
  /**
   * LaTeX environments handling tests
   * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
   */
  'parse environments': function (test) {
    test.equal(latexParser.parse('\\begin{document}\\end{document}').join(),
      'LatexTree.EnvironmentToken{\\begin{document}\\end{document}}');
    test.equal(latexParser.parse('\\begin {document}\\author{Name}\\end{document}').join(),
      'LatexTree.EnvironmentToken{\\begin{document}\\author{Name}\\end{document}}');
    test.done();
  }
};
