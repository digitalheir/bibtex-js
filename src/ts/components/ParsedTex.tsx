import * as React from "react";
import {PureComponent} from "react";

import {
    LatexStyle,
    LatexParser,
    PackageProperties,
    mustBePackageProperties,
    Token,
    Node as TexNode
} from "latex-parser";

import {TexState} from "./TexTranslator";

function convertStyle(styleSrc: string): PackageProperties {
    return mustBePackageProperties(JSON.parse(styleSrc));
}

function convertTex(texSrc: string, styleSrc: string): Token[] {
    const latexStyle = new LatexStyle();
    latexStyle.loadPackage("latex", convertStyle(styleSrc));

    const latexParser: LatexParser = new LatexParser(latexStyle);
    return latexParser.parse(texSrc);
}

function renderTokens(parsed: Token[]): JSX.Element[] {
    return parsed.map((token, i) => <li key={i}><TexNd node={token}/></li>);
}

function renderNodes(parsed: TexNode[]): JSX.Element[] {
    return parsed.map((node, i) => <li key={i}><TexNd node={node}/></li>);
}

export class TexNd extends PureComponent<{ node: TexNode }, { isOpen: boolean }> {

    constructor() {
        super();
        this.state = {isOpen: false};
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        const {node} = this.props;
        const childNodes: TexNode[] = node.childNodes;
        return childNodes.length > 0 ?
            <div className={"tex-node with-children" + (this.state.isOpen ? " open" : " closed")}>
                <div onClick={() => this.toggle()} className="node-label">
                    {node.toString()}
                </div>
                <ol className="node-children">
                    {renderNodes(childNodes)}
                </ol>
            </div> : <div className={"tex-node without-children"}>
                <div className="node-label">
                    {node.toString()}
                </div>
            </div>;
    }
}

export const ParsedTex: React.StatelessComponent<TexState> = ({tex, style}) => {
    try {
        const parsed: Token[] = convertTex(tex, style);

        return <div className="tex-ast">
            <ol className="node-children token-children">
                {renderTokens(parsed)}
            </ol>
        </div>;
    } catch (e) {
        return <div className="error">
            {"ERROR: " + e.message}
        </div>;
    }
};
