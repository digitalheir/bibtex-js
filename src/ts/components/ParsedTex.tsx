import * as React from "react";
import {PureComponent} from "react";

import {
    LatexStyle,
    LatexParser,
    Token,
    Node as TexNode
} from "latex-parser";


function convertTex(texSrc: string, style: LatexStyle): Token[] {
    const latexParser: LatexParser = new LatexParser(style);
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

export const ParsedTex: React.StatelessComponent<{tex: string, style: LatexStyle}> = ({tex, style}) => {
    const parsed: Token[] = convertTex(tex, style);

    return <div className="tex-ast">
        <ol className="node-children token-children">
            {renderTokens(parsed)}
        </ol>
    </div>;
};
