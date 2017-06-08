declare module "lib/Utils" {
    export type StringMap = {
        [s: string]: string;
    };
    export type TargetObject = any;
    export type ValuesObject = any;
    export type OptKeys = StringMap | string[];
    export interface OptAttributes {
        writable: boolean;
        enumerable: boolean;
        configurable: boolean;
    }
    export function updateProperties(target: TargetObject, values: ValuesObject, opt_keys?: OptKeys, opt_attributes?: OptAttributes): void;
    export function testProperties(target: TargetObject, values?: ValuesObject, opt_keys?: OptKeys, opt_skipUndefined?: boolean): boolean;
    export function isNumber(x: any): x is number;
    export function isString(x: any): x is string;
    export function mustNotBeUndefined<T>(x?: T): T;
}
declare module "lib/Latex" {
    export const Lexeme: {
        BINARY_OPERATOR: string;
        BRACKETS: string;
        CELL_SEPARATOR: string;
        CHAR: string;
        DIGIT: string;
        DIRECTIVE: string;
        DISPLAY_EQUATION: string;
        FILE_PATH: string;
        FLOATING_BOX: string;
        HORIZONTAL_SKIP: string;
        INLINE_EQUATION: string;
        LABEL: string;
        LENGTH: string;
        LETTER: string;
        LINE_BREAK: string;
        LIST_ITEM: string;
        LIST: string;
        NUMBER: string;
        PARAGRAPH_SEPARATOR: string;
        PICTURE: string;
        POST_OPERATOR: string;
        PRE_OPERATOR: string;
        RAW: string;
        SPACE: string;
        SUBSCRIPT: string;
        SUPERSCRIPT: string;
        TABLE: string;
        TABULAR_PARAMETERS: string;
        TAG: string;
        UNKNOWN: string;
        VERTICAL_SKIP: string;
        WORD: string;
        WRAPPER: string;
    };
    export type Lexeme = keyof typeof Lexeme;
    export const modes: {
        LIST: string;
        MATH: string;
        PICTURE: string;
        TABLE: string;
        TEXT: string;
        VERTICAL: string;
    };
    export type Mode = keyof typeof modes;
    export function isMode(x: any): x is Mode;
    export function mustBeMode(x: any): Mode;
    export type ModeStates = {
        [mode: string]: boolean;
    };
    export class State {
        private modeStates_;
        constructor(opt_initialModeStates?: ModeStates);
        copy(): State;
        update(modeStates: ModeStates): void;
        test(modeStates: ModeStates): boolean;
    }
    export const Directive: {
        BEGIN: string;
        END: string;
    };
    export type Directive = keyof typeof Directive;
    export const GROUP = "GROUP";
    export type GROUP = 'GROUP';
    export interface OperationProperties {
        directive: Directive;
        operand: Mode | GROUP;
    }
    export function isOperationProperties(x: any): x is OperationProperties;
    export function mustBeOperationProperties(x: any): OperationProperties;
    export class Operation {
        directive: Directive;
        operand: Mode | GROUP;
        constructor(opt_initialProperties?: OperationProperties);
        equals(other: any): boolean;
    }
}
declare module "lib/LatexStyle" {
    import { Lexeme, Operation, OperationProperties, State } from "lib/Latex";
    export interface PackageProperties {
        symbols?: SymbolProperties[];
        commands?: CommandProperties[];
        environments?: EnvironmentProperties[];
    }
    export default class LatexStyle {
        private environments_;
        private commands_;
        private symbols_;
        constructor();
        loadPackage(packageName: string, stylePackage: PackageProperties): void;
        unloadPackage(packageName: string): void;
        symbols(state: State, patternFirstChar: string): Symbol[];
        commands(state: State, name: string): Command[];
        environments(state: State, name: string): EnvironmentAndPackage[];
    }
    export interface ItemProperties {
        lexeme?: Lexeme;
        modes?: {
            [mode: string]: boolean;
        };
    }
    export class Item {
        lexeme?: Lexeme;
        modes: {
            [mode: string]: boolean;
        };
        constructor(opt_initialProperties?: ItemProperties);
        equals(other: any): boolean;
    }
    export interface ParameterProperties extends ItemProperties {
        operations?: (Operation | OperationProperties)[];
    }
    export function isParameterProperties(ignored: any): ignored is ParameterProperties;
    export function mustBeParameterProperties(x: any): ParameterProperties;
    export class Parameter extends Item {
        private operations_;
        constructor(opt_initialProperties?: ParameterProperties);
        readonly operations: Operation[];
        equals(other: any): boolean;
    }
    export interface SymbolProperties extends ItemProperties {
        operations?: (Operation | OperationProperties)[];
        parameters?: (Parameter | ParameterProperties)[];
        pattern?: string;
        html?: string;
    }
    export interface SymbolAndPackage {
        symbol: Symbol;
        packageName: string;
    }
    export class Symbol extends Item {
        private operations_;
        private parameters_;
        private patternComponents_;
        html: string;
        constructor(opt_initialProperties?: SymbolProperties);
        readonly operations: Operation[];
        readonly parameters: Parameter[];
        parameter(parameterIndex: number): Parameter | undefined;
        readonly patternComponents: any[];
        readonly pattern: string;
        equals(other: any): boolean;
    }
    export interface CommandProperties extends SymbolProperties {
        name?: string;
    }
    export interface CommandAndPackage {
        command: Command;
        packageName: string;
    }
    export class Command extends Symbol {
        name: string;
        constructor(opt_initialProperties?: CommandProperties);
        equals(other: any): boolean;
    }
    export function isCommand(c: any): c is Command;
    export function mustBeCommand(c: any): Command;
    export interface EnvironmentProperties extends ItemProperties {
        name?: string;
    }
    export interface EnvironmentAndPackage {
        environment: Environment;
        packageName?: string;
    }
    export class Environment extends Item {
        name: string;
        constructor(opt_initialProperties?: EnvironmentProperties);
        equals(other: any): boolean;
    }
    export function isEnvironment(x: any): x is Environment;
}
declare module "lib/SyntaxTree" {
    export class SyntaxTree {
        readonly rootNode: Node;
        readonly source: string;
        constructor(rootNode: Node, source: string);
    }
    export interface NodeProperties {
        parentNode?: Node;
        childNodes?: Node[];
    }
    export class Node {
        tree: SyntaxTree;
        parentNode: Node;
        private subtreeSize;
        private childNodes_;
        constructor(opt_initialProperties?: NodeProperties);
        readonly childNodes: Node[];
        childNode(node: Node | number): Node | undefined;
        childIndex(node: Node | number): number | undefined;
        insertChildNode(node: Node, childIndex: number, childNodesToCover: number): Node;
        insertChildSubtree(node: Node, childIndex?: number): void;
        removeChildNode(nodeOrNodeIndex: number | Node): Node | undefined;
        removeChildSubtree(node: Node | number): Node | undefined;
        toString(skipNodeClass?: boolean): string;
    }
}
declare module "lib/LatexTree" {
    import { Command, Environment, Parameter, Symbol } from "lib/LatexStyle";
    import { SyntaxTree, Node } from "lib/SyntaxTree";
    import { Lexeme } from "lib/Latex";
    export default class  extends SyntaxTree {
        constructor(rootToken: Token, source: string);
    }
    export interface TokenProperties {
        parentToken?: Token;
        childTokens?: Token[];
    }
    export class Token extends Node {
        lexeme?: Lexeme;
        constructor(opt_initialProperties?: TokenProperties);
        toString(skipNodeClass?: boolean): string;
    }
    export interface SymbolTokenProperties extends TokenProperties {
        symbol?: Symbol;
        pattern?: string;
    }
    export class SymbolToken extends Token {
        symbol?: Symbol;
        constructor(initialProperties: SymbolTokenProperties);
        readonly lexeme: Lexeme | undefined;
        readonly pattern: string;
        toString(skipNodeClass?: boolean): string;
    }
    export interface ParameterTokenProperties extends TokenProperties {
        hasBrackets: boolean;
        hasSpacePrefix: boolean;
    }
    export class ParameterToken extends Token {
        parentNode: SymbolToken;
        private hasBrackets;
        hasSpacePrefix: boolean;
        constructor(initialProperties: ParameterTokenProperties);
        readonly lexeme: Lexeme | undefined;
        readonly parameter: Parameter | undefined;
        toString(skipNodeClass?: boolean): string;
    }
    export interface CommandTokenProperties extends TokenProperties {
        command?: Command;
        name?: string;
    }
    export class CommandToken extends SymbolToken {
        constructor(initialProperties: CommandTokenProperties);
        readonly command: Command;
        readonly name: string;
        toString(skipNodeClass?: boolean): string;
    }
    export function isCommandToken(x: any): x is CommandToken;
    export interface EnvironmentTokenPropertiesWithEnvironment extends EnvironmentTokenProperties {
        environment: Environment;
        name: undefined;
    }
    export interface EnvironmentTokenPropertiesWithName extends EnvironmentTokenProperties {
        environment: undefined;
        name: string;
    }
    export interface EnvironmentTokenProperties extends TokenProperties {
        environment?: Environment;
        name?: string;
    }
    export class EnvironmentToken extends Token {
        environment: Environment;
        constructor(initialProperties: EnvironmentTokenProperties);
        readonly lexeme: "BINARY_OPERATOR" | "BRACKETS" | "CELL_SEPARATOR" | "CHAR" | "DIGIT" | "DIRECTIVE" | "DISPLAY_EQUATION" | "FILE_PATH" | "FLOATING_BOX" | "HORIZONTAL_SKIP" | "INLINE_EQUATION" | "LABEL" | "LENGTH" | "LETTER" | "LINE_BREAK" | "LIST_ITEM" | "LIST" | "NUMBER" | "PARAGRAPH_SEPARATOR" | "PICTURE" | "POST_OPERATOR" | "PRE_OPERATOR" | "RAW" | "SPACE" | "SUBSCRIPT" | "SUPERSCRIPT" | "TABLE" | "TABULAR_PARAMETERS" | "TAG" | "UNKNOWN" | "VERTICAL_SKIP" | "WORD" | "WRAPPER" | undefined;
        readonly beginCommandToken: CommandToken | undefined;
        readonly endCommandToken: CommandToken | undefined;
        readonly bodyToken: EnvironmentBodyToken | undefined;
        toString(skipNodeClass?: boolean): string;
    }
    export function mustBeEnvironmentToken(x: any): EnvironmentToken;
    export function isEnvironmentToken(x: any): x is EnvironmentToken;
    export class EnvironmentBodyToken extends Token {
        readonly environment: Environment | undefined;
        readonly environmentToken: EnvironmentToken | undefined;
        readonly beginCommandToken: CommandToken | undefined;
        readonly endCommandToken: CommandToken | undefined;
        toString(skipNodeClass?: boolean): string;
    }
    export interface SpaceTokenProperties extends TokenProperties {
        lineBreakCount?: number;
    }
    export class SpaceToken extends Token {
        lineBreakCount: number;
        constructor(initialProperties: SpaceTokenProperties);
        readonly lexeme: Lexeme;
        toString(skipNodeClass?: boolean): string;
    }
    export interface SourceTokenProperties extends TokenProperties {
        lexeme: Lexeme;
        source: string;
    }
    export class SourceToken extends Token {
        private source;
        constructor(initialProperties: SourceTokenProperties);
        toString(skipNodeClass?: boolean): string;
    }
}
declare module "lib/LatexParser" {
    import LatexStyle, { Symbol as SymbolItem, Parameter } from "lib/LatexStyle";
    import { Token, EnvironmentToken } from "lib/LatexTree";
    import { Lexeme, Operation, State } from "lib/Latex";
    export class LatexParser {
        latexStyle: LatexStyle;
        constructor(latexStyle: LatexStyle);
        parse(source: string, opt_context?: Context): Token[];
        parseToken_(context: Context): Token | undefined;
        parseParameterToken_(context: Context, parameter: Parameter, opt_endLabel?: string): Token | undefined;
        parseEnvironmentToken_(context: Context): EnvironmentToken | undefined;
        parseCommandToken_(context: Context): Token | undefined;
        parseSymbolsToken_(context: Context): Token;
        parsePatterns_(context: Context, symbols: SymbolItem[]): Token | undefined;
        parsePattern_(context: Context, symbol: SymbolItem): Token | undefined;
        parseUntilLabel_(context: Context, endLabel: string, opt_lexeme?: Lexeme): boolean;
    }
    export class Context {
        source: string;
        position: number;
        currentToken?: Token;
        currentState: State;
        stateStack: State[];
        comments: string[];
        lineNumber: number;
        charNumber: number;
        constructor(opt_source?: string);
        copy(opt_target?: Context): Context;
        updateState(operations: Operation[]): void;
    }
    export default LatexParser;
}
declare module "main" {
    export * from "lib/Utils";
    export * from "lib/Latex";
    export * from "lib/LatexStyle";
    export * from "lib/SyntaxTree";
    export * from "lib/LatexTree";
    export * from "lib/LatexParser";
}
