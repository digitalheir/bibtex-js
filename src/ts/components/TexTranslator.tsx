import * as React from "react";
import {
    isOk,
    latexParser
} from "latex-parser";
import {
    ParsedTex
} from "./ParsedTex";

export interface TexState {
    tex: string;
}

export interface TexProps {
}

/*
 const defaultStyle = {
 symbols: [{
 pattern: "\\\\"
 }],
 commands: [{
 name: "author",
 pattern: "[#1]#2",
 modes: {TEXT: true},
 parameters: [{}, {}],
 operations: []
 }, {
 name: "author",
 pattern: " [#1]#2",
 modes: {TEXT: true},
 parameters: [{}, {}],
 operations: []
 }, {
 name: "author",
 pattern: "#1",
 modes: {TEXT: true},
 parameters: [{}],
 operations: []
 }, {
 name: '"',
 pattern: "[#1]#2",
 modes: {TEXT: true},
 parameters: [{}, {}],
 operations: []
 }, {
 name: '"',
 pattern: " [#1]#2",
 modes: {TEXT: true},
 parameters: [{}, {}],
 operations: []
 }, {
 name: '"',
 pattern: "#1",
 modes: {TEXT: true},
 parameters: [{}],
 operations: []
 }, {
 name: "document",
 modes: {TEXT: true}
 }, {
 name: "enddocument",
 modes: {TEXT: true}
 }],
 environments: [{
 name: "document",
 modes: {TEXT: true}
 }]
 };
 */
// function parseStyleFromProperties(packageProperties: PackageProperties): LatexStyle {
//     const latexStyle = new LatexStyle();
//     latexStyle.loadPackage("latex", packageProperties);
//     return latexStyle;
// }
//
// function parseStyle(styleSrc: string): LatexStyle | Error {
//     try {
//         return parseStyleFromProperties(mustBePackageProperties(JSON.parse(styleSrc)));
//     } catch (e) {
//         return e;
//     }
// }

export class TexTranslator extends React.PureComponent<TexProps, TexState> {
    constructor() {
        super();

        this.state = {
            tex: `an   \\author[optional arg]{author name} and % a comment
more text`,
            // styleSrc: JSON.stringify(defaultStyle, undefined, 2),
            // style: parseStyleFromProperties(defaultStyle)
        };
    }

    onChangeInput(tex: string) {
        this.setState(
            {
                tex,
                // style: this.state.style
            }
        );
    }

    render() {
        // rows="8"
        //                   cols={40}
        return <div className="demo">
            <section className="input-field-tex">
                <h2>TeX source</h2>
                <div className="mdc-textfield mdc-textfield--multiline">
                <textarea
                    className="mdc-textfield__input input"
                    name="tex-input"
                    rows={8}
                    value={this.state.tex}
                    onChange={e => this.onChangeInput(e.target.value)}
                    id="tex-input"
                    placeholder="Input LaTeX / TeX here"
                />
                </div>
            </section>
            <section className="output">
                <h2>Parsed TeX</h2>
                {getParsedTex(this.state.tex)}
            </section>
        </div>;
    }
}

function getParsedTex(tex: string) {
    const result = latexParser.parse(tex);
    if (isOk(result)) {
        return <ParsedTex
            tex={result.value}
        />;
    } else {
        return <div className="error">
            {"ERROR: " + result.expected}
        </div>;
    }
}
