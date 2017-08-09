import * as React from "react";

import {
    BibComment,
    BibFile,
    BibEntry,
    FieldValue,
    AuthorName,
    isAuthors, isBibComment,
    isBibEntry, isBibStringComponent, isPreamble,
    NonBibComment,
    toStringBibStringData
} from "bibtex";
import {ReactElement, StatelessComponent} from "react";

// function isArray(x: any): x is any[] {
//     return x.constructor === Array;
// }

const AuthorComponent: StatelessComponent<{ author: AuthorName }> = ({author}) => {
    const names: ReactElement<any>[] = [];
    if (author.firstNames.length > 0)
        names.push(<tr key="firstNames">
            <td>First names</td>
            <td>{
                author.firstNames.map((n, i) =>
                    <span key={i} className="author-firstName">{n}</span>
                )
            } ({author.initials.map((n, i) =>
                <span key={i} className="author-initial">{n}</span>
            )})
            </td>
        </tr>);

    if (author.vons.length > 0)
        names.push(<tr key="vons">
            <td>von</td>
            <td>{
                author.vons.map((n, i) =>
                    <span key={i} className="author-von">{n}</span>
                )
            }
            </td>
        </tr>);
    if (author.lastNames.length > 0)
        names.push(<tr key="lastNames">
            <td>Last names</td>
            <td>{
                author.lastNames.map((n, i) =>
                    <span key={i} className="author-lastName">{n}</span>
                )
            }
            </td>
        </tr>);
    if (author.jrs.length > 0)
        names.push(<tr key="jrs">
            <td>Jr</td>
            <td>{
                author.jrs.map((n, i) =>
                    <span key={i} className="author-jr">{n}</span>
                )
            }
            </td>
        </tr>);

    return <div className="author-names">
        <div className="author-id">{author.id}</div>
        <table>
            <tbody>
            {names}
            </tbody>
        </table>
    </div>;
};
const ValueCell: StatelessComponent<{ entry: FieldValue }> = ({entry}) => {
    if (isAuthors(entry)) {
        console.log("AUTHRs");
        return <td className="field-value">
            <ul>{
                entry.authors$
                    .map((a, i) => <li key={i}>{
                        <AuthorComponent author={a}/>
                    }</li>)
            }</ul>
        </td>;
    }
    else {
        let newVar = "";
        if (isBibStringComponent(entry))
            newVar = toStringBibStringData(entry.data);
        else newVar = entry + "";
        return <td className="field-value">{
            newVar
        }</td>;
    }
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
            {Object.keys(bib.entries$).map((entry, i) => <li key={i}>{renderEntry(bib.getEntry(entry))}</li>)}
        </ul>
    </div>;
};
