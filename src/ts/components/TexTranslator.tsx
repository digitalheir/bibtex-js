import * as React from "react";
import {ParsedTex} from "./ParsedTex";

export interface TexState {
    tex: string;
    style: string;
}

export interface TexProps {
}

export class TexTranslator extends React.PureComponent<TexProps, TexState> {
    constructor() {
        super();
        this.state = {
            tex: `an   \\author[optional]{author name}`,
            style: JSON.stringify({
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
            }, undefined, 2)
        };
    }

    onChangeInput(tex: string) {
        this.setState(
            {
                tex,
                style: this.state.style
            }
        );
    }

    onChangeStyle(style: string) {
        this.setState(
            {
                style,
                tex: this.state.tex
            }
        );
    }

    render() {
        // rows="8"
        //                   cols={40}
        return <section className="input-fields">
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

            <div className="mdc-textfield mdc-textfield--multiline">
                <textarea
                    className="mdc-textfield__input input"
                    value={this.state.style}
                    name="style-input"
                    rows={8}
                    onChange={e => this.onChangeStyle(e.target.value)}
                    id="style-input"
                    placeholder="Input TeX style here"
                />
            </div>

            <ParsedTex
                style={this.state.style}
                tex={this.state.tex}
            />
        </section>;
    }
}
