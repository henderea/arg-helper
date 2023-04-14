declare function argHelper(arg: any): { argParser: argHelper.argParser };

declare namespace argHelper {
    export interface Map<V> {
        [key: string]: V;
    }

    export interface ArgParser {
        flag(name: string, ...names: Array<string | Function>): this;
        flags(name: string, ...names: Array<string | Function>): this;
        string(name: string, ...names: Array<string>): this;
        strings(name: string, ...names: Array<string>): this;
        bool(name: string, ...names: Array<string>): this;
        bools(name: string, ...names: Array<string>): this;
        number(name: string, ...names: Array<string>): this;
        numbers(name: string, ...names: Array<string>): this;
        count(name: string, ...names: Array<string>): this;
        helpText(helpText: string, ...names: Array<string>): this;
        findVersion(callerPath: string, ...names: Array<string>): this;
        version(packageJsonFile: string, ...names: Array<string>): this;
        parse(argv?: Array<any> | null): Map<any>;
        get argv(): Map<any>;
        static terminalWidth(multiplier?: number): number;
    }

    export interface argParser {
        (): ArgParser;
        terminalWidth(multiplier?: number): number;
    }
}

export = argHelper;
