import {BibStringData, BibStringDatum} from "../../datatype/string/BibStringData";
import {isString} from "../../../util";
import {isOuterQuotedString, isQuotedString} from "../../datatype/string/QuotedString";
import {isStringRef} from "../../datatype/string/StringRef";
import {isOuterBracedString} from "../../datatype/string/BracedString";
import {splitOnAnd, splitOnComma, splitOnPattern} from "../../datatype/string/bib-string-utils";

function word2string(obj) {
    if (typeof obj === "string") return obj;
    else if (obj.type == "braced") return word2string(obj.data);
    else if (obj.unicode) return obj.unicode;
    else if (obj.string) return obj.string;
    else if (obj.constructor == Array) return obj.map(word2string).join("");
    else throw new Error("? " + JSON.stringify(obj));
}

const WHITESPACES = /\s+/g;

export class AuthorName {
    readonly firstNames: BibStringData[];
    readonly initials: string[];
    readonly vons: BibStringData[];
    readonly lastNames: BibStringData[];
    readonly jrs: BibStringData[];

    readonly id: string;

    /**
     * @param firstNames Array of word objects
     * @param vons Array of word objects
     * @param lastNames Array of word objects
     * @param jrs Array of word objects
     */
    constructor(firstNames: BibStringData[], vons: BibStringData[], lastNames: BibStringData[], jrs: BibStringData[]) {
        this.firstNames = firstNames;
        this.initials = this.firstNames.map(getFirstLetter);
        this.vons = vons;
        this.lastNames = lastNames; // .map(flattenToString); // todo ?
        this.jrs = jrs; // .map(flattenToString); // todo ?

        this.id = this.firstNames.join("-") + "-" + this.vons.join("-") + "-" + this.lastNames.join("-") + "-" + this.jrs.join("-");
    }
}

function getFirstLetter(bsd: BibStringData) {
    return "TODO"; // todo
}

function isPartOfName(char) {
    return (char === "," || char.match(/\s/));
}

function startsWithLowerCaseBSD(authorToken: BibStringData) {
    if (authorToken.length > 0) return startsWithLowerCase(authorToken[0]);
    else return false;
}

function startsWithLowerCase(authorToken: BibStringDatum) {
    if (isString(authorToken)) {
        if (!authorToken) return false;
        const ch = authorToken.charAt(0);
        return ch.toLowerCase() === ch && ch.toUpperCase() !== ch;
    }

    if (isQuotedString(authorToken)) {
        // TODO must be flattened string...?
        if (!authorToken.data || authorToken.data.length <= 0) return false;
        return startsWithLowerCase(authorToken.data[0]);
    }

    if (isStringRef(authorToken)
        || isOuterQuotedString(authorToken)
        || isOuterBracedString(authorToken)
    ) throw new Error("Should not do this test on this type");

    return false;
}

function firstVonLast(outer: BibStringData): AuthorName {
    const authorTokens: BibStringData[] = splitOnPattern(outer, WHITESPACES);

    let vonStartInclusive = -1;
    let vonEndExclusive = -1;
    let firstNameEndExclusive = -1;

    for (let i = 0; i < authorTokens.length - 1; i++) {
        if (startsWithLowerCaseBSD(authorTokens[i])) {
            if (vonStartInclusive < 0)
            // Start von if not already started
                vonStartInclusive = i;
            // End von at last word that starts with lowercase
            vonEndExclusive = i + 1;
        }
    }
    if (vonStartInclusive >= 0) firstNameEndExclusive = vonStartInclusive;
    else firstNameEndExclusive = authorTokens.length - 1;

    const von: BibStringData[] = vonStartInclusive >= 0 ? getSubStringAsArray(authorTokens, vonStartInclusive, vonEndExclusive) : [];
    const firstName: BibStringData[] = getSubStringAsArray(authorTokens, 0, firstNameEndExclusive);
    const lastName: BibStringData[] = getSubStringAsArray(authorTokens, Math.max(vonEndExclusive, firstNameEndExclusive), authorTokens.length);

    return new AuthorName(
        firstName,
        von,
        lastName,
        []
    );
}

function vonLastFirst(vonLastStr: BibStringData, firstStr: BibStringData) {
    const vonLast = splitOnPattern(vonLastStr, WHITESPACES);
    const first = splitOnPattern(firstStr, WHITESPACES);

    let vonStartInclusive = -1;
    let vonEndExclusive = -1;

    for (let i = 0; i < vonLast.length; i++)
        if (startsWithLowerCaseBSD(vonLast[i])) {
            if (vonStartInclusive < 0) vonStartInclusive = i;
            vonEndExclusive = i + 1;
        }

    const von = vonStartInclusive >= 0 ? getSubStringAsArray(vonLast, 0, vonEndExclusive) : [];
    const firstName = first;
    const lastName = getSubStringAsArray(vonLast, Math.max(vonEndExclusive, 0));

    return new AuthorName(
        firstName,
        von,
        lastName,
        []
    );
}


function getSubStringAsArray<T>(tokens: T[], startIncl: number, endExcl?: number) {
    const arr: T[] = [];
    for (let i = startIncl; i < (endExcl === undefined ? tokens.length : endExcl); i++) {
        arr.push(tokens[i]);
    }
    return arr;
}

function vonLastJrFirst(vonLastStr: BibStringData, jrStr: BibStringData, firstStr: BibStringData) {
    const vonLast = splitOnPattern(vonLastStr, WHITESPACES);
    const first = splitOnPattern(firstStr, WHITESPACES);
    const jr = splitOnPattern(jrStr, WHITESPACES);

    let vonStartInclusive = -1;
    let vonEndExclusive = -1;

    for (let i = 0; i < vonLast.length; i++)
        if (startsWithLowerCaseBSD(vonLast[i])) {
            if (vonStartInclusive < 0) vonStartInclusive = i;
            vonEndExclusive = i + 1;
        }

    const von = vonStartInclusive >= 0 ? getSubStringAsArray(vonLast, 0, vonEndExclusive) : [];
    const lastName = getSubStringAsArray(vonLast, Math.max(vonEndExclusive, 0));

    return new AuthorName(
        first,
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
 */
export function parseAuthorName(normalizedFieldValue: BibStringData): AuthorName {
    const partitions: BibStringData[] = splitOnComma(normalizedFieldValue);

    // console.log(commaCount,JSON.stringify(authorRaw));
    switch (partitions.length) {
        case 1:
            return firstVonLast(normalizedFieldValue);
        case 2:
            return vonLastFirst(mdbsd(partitions[0]), mdbsd(partitions[1]));
        case 3:
            return vonLastJrFirst(mdbsd(partitions[0]), mdbsd(partitions[1]), mdbsd(partitions[2]));
        default:
            throw new Error(`Could not parse author name: partitioned as ${JSON.stringify(partitions)} in ${JSON.stringify(normalizedFieldValue)}`);
    }
}

function isdbsd(x: any): x is BibStringData {
    return x !== undefined;
}

function mdbsd(x: any): BibStringData {
    if (isdbsd(x)) return x; else throw new Error("???????");
}


export class Authorrr {
    readonly first;
    readonly von;
    readonly last;

    constructor(first: string, von: string | undefined, last: string | undefined) {
        this.first = first;
        this.von = von;
        this.last = last;
    }
}