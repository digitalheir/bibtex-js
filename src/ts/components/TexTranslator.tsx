import * as React from "react";

export interface TexState {
    input: string;
    style: string;
}

export interface TexProps {
}

export class TexTranslator extends React.PureComponent<TexProps, TexState> {
    constructor() {
        super();
        this.state = {input: ""};
    }

    onChangeInput(input: string) {
        this.setState(
            {
                input,
                style: this.state.style
            }
        );
    }

    onChangeStyle(style: string) {
        this.setState(
            {
                style,
                input: this.state.input
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
                    onChange={e => this.onChangeInput(e.target.value)}
                    id="tex-input"
                    placeholder="Input LaTeX / TeX here"
                />
            </div>

            <div className="mdc-textfield mdc-textfield--multiline">
                <textarea
                    className="mdc-textfield__input input"
                    name="tex-input"
                    rows={8}
                    onChange={e => this.onChangeStyle(e.target.value)}
                    id="tex-input"
                    placeholder="Input TeX style here"
                />
            </div>

            <ParsedTex
                style={this.state.style}
                tex={this.state.input}
            />
        </section>;
    }

    private convertInputUnicode() {
        // TODO
        return this.state.input;
    }

    private convertInputHtml() {
        // TODO
        return this.state.input;
    }
}
