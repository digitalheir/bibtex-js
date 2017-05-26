function isPartOfName(char) {
    return (char == "," || char.match(/\s/));
}

function splitOnAnd(authorTokens) {
    return authorTokens.reduce((prev, curr) => {
        // console.log(curr);
        if (curr.length == 1 && curr[0] == "and") prev.push([]);
        else prev[prev.length - 1].push(curr);
        return prev;
    }, [[]]);
}


function firstVonLast(authorTokens) {
    let vonStartInclusive = -1;
    let vonEndExclusive = -1;
    let firstNameEndExclusive = -1;
    for (let i = 0; i < authorTokens.length - 1; i++) {// -1 because last word must be lastName
        // console.log("STARLOW", (authorTokens[i]));
        // console.log("STARLOW", startsWithLowerCase(authorTokens[i]));
        if (startsWithLowerCase(authorTokens[i])) {
            if (vonStartInclusive < 0) vonStartInclusive = i;
            vonEndExclusive = i + 1;
        }
    }
    if (vonStartInclusive > 0) firstNameEndExclusive = vonStartInclusive;
    else firstNameEndExclusive = authorTokens.length - 1;

    const von = vonStartInclusive > 0 ? getSubStringAsArray(authorTokens, vonStartInclusive, vonEndExclusive) : [];
    const firstName = getSubStringAsArray(authorTokens, 0, firstNameEndExclusive);
    const lastName = getSubStringAsArray(authorTokens, Math.max(vonEndExclusive, firstNameEndExclusive), authorTokens.length);

    return new PersonName(
        firstName,
        von,
        lastName,
        []
    );
}

function vonLastFirst(authorTokens) {
    let commaPos = -1;
    for (let i = 0; i < authorTokens.length; i++)
        if (authorTokens[i].type == ",") {
            commaPos = i;
            break;
        }
    let vonStartInclusive = -1;
    let vonEndExclusive = -1;

    for (let i = 0; i < commaPos; i++)
        if (startsWithLowerCase(authorTokens[i])) {
            if (vonStartInclusive < 0) vonStartInclusive = i;
            vonEndExclusive = i + 1;
        }

    const von = vonStartInclusive > 0 ? getSubStringAsArray(authorTokens, 0, vonEndExclusive) : [];
    const firstName = getSubStringAsArray(authorTokens, commaPos + 1, authorTokens.length);
    const lastName = getSubStringAsArray(authorTokens, Math.max(vonEndExclusive, 0), commaPos);

    return new PersonName(
        firstName,
        von,
        lastName,
        []
    );
}


function getSubStringAsArray(tokens, startIncl, endExcl) {
    let arr = [];
    for (let i = startIncl; i < endExcl; i++) {
        if (!(tokens[i].constructor == Array && tokens[i].length == 0)) arr.push(tokens[i]);
    }
    return arr;
}
function vonLastJrFirst(authorTokens) {
    let commaPos = -1;
    for (let i = 0; i < authorTokens.length; i++)
        if (authorTokens[i].type == ",") {
            commaPos = i;
            break;
        }
    let commaPos2 = -1;
    for (let i = commaPos + 1; i < authorTokens.length; i++)
        if (authorTokens[i].type == ",") {
            commaPos2 = i;
            break;
        }
    let vonStartInclusive = -1;
    let vonEndExclusive = -1;

    for (let i = 0; i < commaPos; i++)
        if (startsWithLowerCase(authorTokens[i])) {
            if (vonStartInclusive < 0) vonStartInclusive = i;
            vonEndExclusive = i + 1;
        }

    const von = vonStartInclusive > 0 ? getSubStringAsArray(authorTokens, 0, vonEndExclusive) : [];
    const firstName = getSubStringAsArray(authorTokens, commaPos2 + 1, authorTokens.length);
    const jr = getSubStringAsArray(authorTokens, commaPos + 1, commaPos2);
    const lastName = getSubStringAsArray(authorTokens, Math.max(vonEndExclusive, 0), commaPos);

    return new PersonName(
        firstName,
        von,
        lastName,
        jr
    );
}

/**
 * BibTEX must be able to distinguish between the different parts of the author field. To that
 * aim, BibTEX recognizes three possible formats:
 * • First von Last;
 * • von Last, First;
 * • von Last, Jr, First.
 *
 * The format to be considered is obtained by counting the number of commas in the name. Here are
 * the characteristics of these formats:
 * @param authorRaw
 */
function parseAuthor(authorRaw: ParsedTokensWrapper[]): string {
    const commaCount = authorRaw.reduce((prev, cur) => {
            return prev + (cur.type == "," ? 1 : 0);
        }, 0
    );
    // console.log(commaCount,JSON.stringify(authorRaw));
    switch (commaCount) {
        case 0:
            return firstVonLast(authorRaw);
        case 1:
            return vonLastFirst(authorRaw);
        case 2:
            return vonLastJrFirst(authorRaw);
        default:
            throw new Error("Could not parse author name: found " + commaCount + " commas in " + JSON.stringify(authorRaw));
    }
}

export default class Author {
    readonly first;
    readonly von;
    readonly last;

    constructor(first: string, von: string | undefined, last: string | undefined) {
        this.first = first;
        this.von = von;
        this.last = last;
    }
}