import * as React from "react";
import {StatelessComponent} from "react";
import {Parser, Result} from "parsimmon";

import {
    isTeXBraces,
    isTeXComm,
    isTeXComment,
    isFixArg,
    isOptArg,
    isTeXEnv, isTeXLineBreak, isTeXMath,
    isTeXRaw,
    LaTeX,
    TeXArg
} from "latex-parser";

const Arguments: StatelessComponent<{ args: TeXArg[] }> = ({args}) => <span>
    {[].concat(...args.map((e, i) => [", ", <span key={i}>{renderTokens(e)}</span>])).slice(1)}
    </span>;

function isArray(x: any): x is LaTeX[] {
    return x.constructor === Array;
}

function renderTokens(parsed: LaTeX): React.ReactElement<any> {
    if (isTeXComment(parsed))
        return <span className={"TeXBlock " + parsed.type}>{parsed.text}<br/></span>;
    else if (isTeXRaw(parsed))
        return <span className={"TeXBlock " + parsed.type}>{parsed.text}</span>;
    else if (isTeXComm(parsed) || isTeXEnv(parsed))
        return <span className={"TeXBlock " + parsed.type}>{<span className="name">{parsed.name}</span>} (
            <Arguments args={parsed.arguments}/>
            )</span>;
    else if (isTeXMath(parsed))
        return <span className={"TeXBlock " + parsed.type}>$ {renderTokens(parsed.latex)} $</span>;
    else if (isTeXLineBreak(parsed))
        return <div className={"TeXLine"}><br/><br/></div>;
    else if (isTeXBraces(parsed))
        return <span className={"TeXBlock " + parsed.type}>{renderTokens(parsed.latex)}</span>;
    else if (isFixArg(parsed))
        return <span className={"TeXBlock " + parsed.type}>{renderTokens(parsed.latex)}</span>;
    else if (isOptArg(parsed))
        return <span className={"TeXBlock " + parsed.type}>{renderTokens(parsed.latex)}</span>;
    else if (isArray(parsed))
        return <span>{parsed.map((e, i) => <span key={i}>{renderTokens(e)}</span>)}</span>;
    else {
        console.error("Don't know how to deal with TeX:");
        console.error(parsed);
        return <span>???</span>;
    }
}

// function renderNodes(parsed: LaTeX) {
//     return <li/>; // parsed.map((node, i) => <li key={i}><TexNd node={node}/></li>);
// }
//
// export class TexNd extends PureComponent<{ node: LaTeX }, { isOpen: boolean }> {
//
//     constructor() {
//         super();
//         this.state = {isOpen: false};
//     }
//
//     toggle() {
//         this.setState({isOpen: !this.state.isOpen});
//     }
//
//     render() {
//         const {node} = this.props;
//         return childNodes.length > 0 ?
//             <div className={"tex-node with-children" + (this.state.isOpen ? " open" : " closed")}>
//                 <div onClick={() => this.toggle()} className="node-label">
//                     {node.toString()}
//                 </div>
//                 <ol className="node-children">
//                     {renderNodes(childNodes)}
//                 </ol>
//             </div> : <div className={"tex-node without-children"}>
//                 <div className="node-label">
//                     {node.toString()}
//                 </div>
//             </div>;
//     }
// }

export const ParsedTex: React.StatelessComponent<{ tex: LaTeX[] }> = ({tex}) => {
    return <div className="tex-ast">
        <div className="node-children token-children">
            {tex.map((latexBlock, i) => <span key={i}>{renderTokens(latexBlock)}</span>)}
        </div>
    </div>;
};
