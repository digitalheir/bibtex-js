import * as React from "react";
import {
    BibFileComponent
} from "./BibFile";
import {parseBibFile} from "bibtex";

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
            tex: `@Book{abramowitz+stegun,
 author    = "Milton {Abramowitz} and Irene A. {Stegun}",
 title     = "Handbook of Mathematical Functions with
              Formulas, Graphs, and Mathematical Tables",
 publisher = "Dover",
 year      =  1964,
 address   = "New York City",
 edition   = "ninth Dover printing, tenth GPO printing"
}`,
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
            <div className="input-field-tex">
                <h2>BibTeX source</h2>
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
            </div>
            <div className="output">
                {getParsedTex(this.state.tex)}
            </div>
        </div>;
    }
}

function getParsedTex(tex: string) {
    const result = parseBibFile(tex);
    return <BibFileComponent
        bib={result}
    />;
}
