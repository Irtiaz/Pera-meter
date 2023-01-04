class FunctionObject {
    private name: string;
    private readonly fn: (a: number, b: number) => number;
    private code: string;

    public constructor(name: string, fn: (a: number, b: number) => number, code: string) {
        this.name = name;
        this.fn = fn;
        this.code = code;
    }

    public evaluate(a: number, b: number): number {
        return this.fn(a, b);
    }

    public toString(): string {
        let ret: string = this.name + "(a, b):\n";
        for (let line of this.code.split("\n")) {
            ret += "\t" + line + "\n";
        }
        return ret;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getCode(): string {
        return this.code;
    }

    public setCode(code: string): void {
        this.code = code;
    }
}


class FunctionDatabase {
    private readonly functions: Array<FunctionObject>;

    public constructor() {
        this.functions = [];
    }

    public add(fObj: FunctionObject): void {
        this.functions.push(fObj);
    }

    public callFunction(name: string, a: number, b: number): number {
        for (let f of this.functions) {
            if (f.getName() === name) {
                return f.evaluate(a, b);
            }
        }
        throw new Error("Function not found");
    }

    public toString(): string {
        let ret: string = "";
        for (let f of this.functions) {
            ret += f.toString() + "\n\n";
        }
        return ret;
    }

    public getManPageOfFunction(name: string): string {
        for (let f of this.functions) {
            if (f.getName() === name) {
                return f.toString();
            }
        }
        return "Function " + name + " not found";
    }

    public renameFunction(prevName: string, newName: string): boolean {
        let found: boolean = false;
        for (let f of this.functions) {
            if (f.getName() === prevName) {
                f.setName(newName);
                found = true;
            }
        }
        if (!found) {
            return false;
        }
        for (let f of this.functions) {
            f.setCode(f.getCode().replace(new RegExp(prevName, 'g'), newName));
        }
        return true;
    }
}

class Level {
    private readonly funcNames: Array<string>;
    private readonly numberList: Array<number>;
    private readonly functionDatabase: FunctionDatabase;
    private readonly target: number;


    public constructor(funcNames: Array<string>, numberList: Array<number>, functionDatabase: FunctionDatabase, target: number) {
        this.funcNames = funcNames;
        this.numberList = numberList;
        this.functionDatabase = functionDatabase;
        this.target = target;
    }

    public evaluateFunction(functionName: string, a: number, b: number): string {
        if (this.numberList.indexOf(a) < 0 || this.numberList.indexOf(b) < 0) {
            return "Numbers are not available";
        }
        for (let name of this.funcNames) {
            if (name === functionName) {
                const n: number = this.functionDatabase.callFunction(name, a, b);
                this.numberList.push(n);
                if (n === this.target) {
                    return n.toString() + " reached. Level passed";
                }
                return n.toString();
            }
        }
        return "Can't call a function named " + functionName;
    }

    public isLevelPassed(): boolean {
        for (let n of this.numberList) {
            if (n === this.target) {
                return true;
            }
        }
        return false;
    }

    public getNumberListStr(): string {
        let ret: string = "";
        for (let n of this.numberList) {
            ret += n.toString() + "\n";
        }
        return ret;
    }

    public renameFunction(prevName: string, newName: string): boolean {
        for (let i = 0; i < this.funcNames.length; ++i) {
            if (this.funcNames[i] === prevName) {
                this.funcNames[i] = newName;
                return true;
            }
        }
        return false;
    }
}


function add(a: number, b: number): number {
    return a + b;
}

function sub(a: number, b: number): number {
    return add(a, b) - b;
}

export default class GameManager {
    private readonly levels: Array<Level>;
    private currentLevelIndex: number;
    private readonly functionDatabase: FunctionDatabase;

    public constructor() {
        this.functionDatabase = new FunctionDatabase();
        this.functionDatabase.add(new FunctionObject('ADD', add, "return a + b"));
        this.functionDatabase.add(new FunctionObject('SUB', sub, "return ADD(a, b) - b"));
        this.levels = [];
        this.levels.push(new Level(['ADD', 'SUB'], [3, 7, 10], this.functionDatabase, 4));
        this.currentLevelIndex = 0;
    }

    public gameOver(): boolean {
        return this.currentLevelIndex >= this.levels.length;
    }

    public feedCommand(command: string): string {
        if (command === "") {
            return "";
        }
        if (command === "LS") {
            return this.levels[this.currentLevelIndex].getNumberListStr();
        }
        if (command === "MAN") {
            return this.functionDatabase.toString();
        }
        if (command === "HELP") {
            return this.getHelpText();
        }
        let splitCommand = command.split(" ");
        if (splitCommand.length === 2) {
            if (splitCommand[0] === "MAN") {
                return this.functionDatabase.getManPageOfFunction(splitCommand[1]);
            }
        }
        if (splitCommand.length === 3) {
            if (splitCommand[0] === "RENAME") {
                if (splitCommand[2] === "RENAME") {
                    return "Can not change name to keyword RENAME";
                }
                for (let l of this.levels) {
                    l.renameFunction(splitCommand[1], splitCommand[2]);
                }
                let found: boolean = this.functionDatabase.renameFunction(splitCommand[1], splitCommand[2]);
                if (found) {
                    return "Function " + splitCommand[1] + " renamed to " + splitCommand[2];
                } else {
                    return "Function " + splitCommand[1] + " not found";
                }
            }

            let funcName: string = splitCommand[0];
            if (!Number.isInteger(Number(splitCommand[1])) || !Number.isInteger(Number(splitCommand[2]))) {
                return "Arguments must be integers";
            }
            let a: number = parseInt(splitCommand[1]);
            let b: number = parseInt(splitCommand[2]);
            let r: string = this.levels[this.currentLevelIndex].evaluateFunction(funcName, a, b);
            if (this.levels[this.currentLevelIndex].isLevelPassed()) {
                ++this.currentLevelIndex;
            }
            return r;
        }
        return "Unknown command";
    }

    private getHelpText(): string {
        return "No help text for now";
    }
}