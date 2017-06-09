import {Command, Environment} from "../../sources/lib/LatexStyle";
import {
  CommandToken, ParameterToken, SourceToken, SpaceToken, EnvironmentBodyToken,
  EnvironmentToken
} from "../../sources/lib/LatexTree";
/**
 * @fileoverview LaTeX syntax tree structure element tests
 * This file is a part of TeXnous project.
 *
 * @copyright TeXnous project team (http://texnous.org) 2016
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

import {expect} from "chai";
import {Lexeme} from "../../sources/lib/Latex";

let documentBeginCommand = new Command({ name: 'document' });
let documentEndCommand = new Command({ name: 'enddocument' });
let documentEnvironment =  new Environment({ name: 'document' });
let authorCommand = new Command({ name: 'author', pattern: '[#1]#2', parameters: [{}, {}] });


/**
 * LaTeX tree token class tests
 * @author Kirill Chuvilin <kirill.chuvilin@gmail.com>
 */
describe("Token", () => {
  const numberToken =  new SourceToken({ source: "123", lexeme: "NUMBER" });
  const wordToken = new SourceToken({ source: "Name", lexeme: "WORD" });
  const spaceToken =  new SpaceToken({});
  const parameterToken1 =new ParameterToken({ hasBrackets: false, hasSpacePrefix: false, childTokens: [ numberToken ]});
  const parameterToken2 = new ParameterToken({ hasBrackets: true, hasSpacePrefix: true, childTokens: [ wordToken, spaceToken ]});
  const commandToken = new CommandToken({ command: authorCommand, childTokens: [ parameterToken1, parameterToken2 ]});
  const paragraphSeparatorToken =  new SpaceToken({ lineBreakCount: 2 });
  const environmentBeginCommandToken = new CommandToken({ command: documentBeginCommand });
  const environmentEndCommandToken = new CommandToken({ command: documentEndCommand });
  const environmentBodyToken = new EnvironmentBodyToken({ childTokens: [ commandToken, paragraphSeparatorToken ]});
  const environmentToken = new EnvironmentToken({ environment: documentEnvironment, childTokens: [ environmentBeginCommandToken, environmentBodyToken, environmentEndCommandToken ] });

  it("constructor", function () {
    // expect(function () {numberToken =  new SourceToken({ source: '123', lexeme: Lexeme.NUMBER });}).to.throw;
    // expect(function () {wordToken =new SourceToken({ source: 'Name', lexeme: Lexeme.WORD }) }).to.throw;
    expect(function () { new SpaceToken({lineBreakCount: -1}) }).to.throw;
    expect(function () { new ParameterToken({ hasBrackets: false, hasSpacePrefix: false, childTokens: [ numberToken ]}) }).to.throw;
    expect(function () { new ParameterToken({ hasBrackets: true, hasSpacePrefix: true, childTokens: [ wordToken, spaceToken ]}) }).to.throw;
    expect(function () { new CommandToken({ command: authorCommand, childTokens: [ parameterToken1, parameterToken2 ]}) }).to.throw;
    expect(function () { new SpaceToken({ lineBreakCount: 2 }) }).to.throw;
    expect(function () { new CommandToken({ command: documentBeginCommand }) }).to.throw;
    expect(function () { new CommandToken({ command: documentEndCommand }) }).to.throw;
    expect(function () { new EnvironmentBodyToken({ childTokens: [ commandToken, paragraphSeparatorToken ]}) }).to.throw;
    expect(function () { new EnvironmentToken({ environment: documentEnvironment, childTokens: [ environmentBeginCommandToken, environmentBodyToken, environmentEndCommandToken ] }) }).to.throw;
  });
  it("insertChildNode", function () {
    // expect(function () { spaceToken.insertChildNode(new ParameterToken({})) }).to.throw;
  });
  it("toString", function () {
    expect(numberToken.toString()).to.equal('SourceToken[NUMBER]{123}');
    expect(wordToken.toString()).to.equal('SourceToken[WORD]{Name}');
    expect(spaceToken.toString()).to.equal('SpaceToken{ }');
    expect(paragraphSeparatorToken.toString()).to.equal('SpaceToken{\n\n}');
    expect(parameterToken1.toString()).to.equal('ParameterToken{123}');
    expect(parameterToken2.toString()).to.equal('ParameterToken{ {Name }}');
    expect(commandToken.toString()).to.equal('CommandToken{\\author[123] {Name }}');
    expect(environmentBeginCommandToken.toString()).to.equal('CommandToken{\\document}');
    expect(environmentEndCommandToken.toString()).to.equal('CommandToken{\\enddocument}');
    expect(environmentBodyToken.toString()).to.equal('EnvironmentBodyToken{\\author[123] {Name }\n\n\}');
    expect(environmentToken.toString()).to.equal('EnvironmentToken{\\begin{document}\\author[123] {Name }\n\n\\end{document}}');
  });
});
