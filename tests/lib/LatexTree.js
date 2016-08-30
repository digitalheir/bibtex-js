/**
 * @fileoverview LaTeX syntax tree structure element tests
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

const Latex = require('../../deploy/lib/Latex'); // general LaTeX definitions
const LatexStyle = require('../../deploy/lib/LatexStyle'); // LaTeX style structures
const LatexTree = require('../../deploy/lib/LatexTree'); // syntax tree structure elements


let documentBeginCommand = new LatexStyle.Command({ name: 'document' });
let documentEndCommand = new LatexStyle.Command({ name: 'enddocument' });
let documentEnvironment =  new LatexStyle.Environment({ name: 'document' });
let authorCommand = new LatexStyle.Command({ name: 'author', pattern: '[#1]#2', parameters: [{}, {}] });

let
  numberToken,
  wordToken,
  spaceToken,
  paragraphSeparatorToken,
  parameterToken1,
  parameterToken2,
  commandToken,
  environmentBeginCommandToken,
  environmentEndCommandToken,
  environmentBodyToken,
  environmentToken;


/**
 * LaTeX tree token class tests
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
module.exports['Token'] = {
  'constructor': function (test) {
    test.doesNotThrow(function () {
      //noinspection JSUnresolvedVariable
      numberToken =  new LatexTree.SourceToken({ source: '123', lexeme: Latex.Lexeme.NUMBER });
    });
    test.doesNotThrow(function () { //noinspection JSUnresolvedVariable
      wordToken =
      new LatexTree.SourceToken({ source: 'Name', lexeme: Latex.Lexeme.WORD }) });
    test.doesNotThrow(function () { spaceToken =  new LatexTree.SpaceToken() });
    test.doesNotThrow(function () { parameterToken1 =
      new LatexTree.ParameterToken({ hasBrackets: false, hasSpacePrefix: false, childTokens: [ numberToken ]}) });
    test.doesNotThrow(function () { parameterToken2 = new LatexTree.ParameterToken({
      hasBrackets: true, hasSpacePrefix: true, childTokens: [ wordToken, spaceToken ]}) });
    test.doesNotThrow(function () { commandToken = new LatexTree.CommandToken({
      command: authorCommand, childTokens: [ parameterToken1, parameterToken2 ]}) });
    test.doesNotThrow(function () { paragraphSeparatorToken =  new LatexTree.SpaceToken({ lineBreakCount: 2 }) });
    test.doesNotThrow(function () { environmentBeginCommandToken =
      new LatexTree.CommandToken({ command: documentBeginCommand }) });
    test.doesNotThrow(function () { environmentEndCommandToken =
      new LatexTree.CommandToken({ command: documentEndCommand }) });
    test.doesNotThrow(function () { environmentBodyToken =
      new LatexTree.EnvironmentBodyToken({ childTokens: [ commandToken, paragraphSeparatorToken ]}) });
    test.doesNotThrow(function () { environmentToken =
        new LatexTree.EnvironmentToken({ environment: documentEnvironment, childTokens: [
            environmentBeginCommandToken, environmentBodyToken, environmentEndCommandToken
        ] }) });
    test.done();
  },
  'insertChildNode': function (test) {
    //noinspection JSCheckFunctionSignatures
    test.throws(function () { spaceToken.insertChildNode(new LatexTree.ParameterToken({})) });
    test.done();
  },
  'toString': function (test) {
    test.equal(numberToken.toString(), 'LatexTree.SourceToken[NUMBER]{123}');
    test.equal(wordToken.toString(), 'LatexTree.SourceToken[WORD]{Name}');
    test.equal(spaceToken.toString(), 'LatexTree.SpaceToken{ }');
    test.equal(paragraphSeparatorToken.toString(), 'LatexTree.SpaceToken{\n\n}');
    test.equal(parameterToken1.toString(), 'LatexTree.ParameterToken{123}');
    test.equal(parameterToken2.toString(), 'LatexTree.ParameterToken{ {Name }}');
    test.equal(commandToken.toString(), 'LatexTree.CommandToken{\\author[123] {Name }}');
    test.equal(environmentBeginCommandToken.toString(), 'LatexTree.CommandToken{\\document}');
    test.equal(environmentEndCommandToken.toString(), 'LatexTree.CommandToken{\\enddocument}');
    test.equal(environmentBodyToken.toString(),
      'LatexTree.EnvironmentBodyToken{\\author[123] {Name }\n\n\}');
    test.equal(environmentToken.toString(),
      'LatexTree.EnvironmentToken{\\begin{document}\\author[123] {Name }\n\n\\end{document}}');
    test.done();
  }
};
