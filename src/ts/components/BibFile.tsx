import * as React from "react";

import {
    BibComment, BibEntry, BibFile,
    FieldValue, isBibComment,
    isBibEntry, isBibStringComponent, isPreamble,
    NonBibComment,
    toStringBibStringData
} from "bibtex";
import {StatelessComponent} from "react";

function isArray(x: any): x is any[] {
    return x.constructor === Array;
}

const ValueCell: StatelessComponent<{ entry: FieldValue }> = ({entry}) => {
    let newVar = "";
    if (isBibStringComponent(entry))
        newVar = toStringBibStringData(entry.data);
    else newVar = entry + "";

    return <td className="field-value">{
        newVar
    }</td>;
};

const BibEntryComponent: StatelessComponent<{ entry: BibEntry }> = ({entry}) => {
    return <div className="bib-entry">
        <div className="id">
            {entry._id}
        </div>
        <table>
            <tbody>
            {Object.keys(entry.fields).map((fieldName, i) => <tr key={i}>
                <td className="field-name">{fieldName}</td>
                <ValueCell entry={entry.fields[fieldName]}/>
            </tr>)}
            </tbody>
        </table>
        </div>;
};

function renderEntry(entry: (NonBibComment | BibComment)): React.ReactElement<any> {

    if (isBibEntry(entry))
        return <BibEntryComponent entry={entry}/>;
    // TODO
    // if(isCommentEntry(entry))
    //     return <tr className="comment-entry">{}</tr>;
    // TODO
    // if(isBibStringEntry(entry))
    //     return <tr className="bib-string">{}</tr>;
    if (isPreamble(entry))
        return <div className="bib-string">{}</div>;
    if (isBibComment(entry))
        return <div className="bib-comment">{}</div>;

    console.error("Unknown entry: ");
    console.error(entry);
    return <div>???</div>;
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

export const BibFileComponent: React.StatelessComponent<{ bib: BibFile }> = ({bib}) => {
    return <div className="bibfile">
        <ul className="biblist">
            {bib.content.map((entry, i) => <li key={i}>{renderEntry(entry)}</li>)}
        </ul>
    </div>;
};
