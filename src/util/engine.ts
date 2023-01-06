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
        let ret: string = this.name + " a b :\n";
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

    public callFunction(name: string, a: number, b: number): string {
        for (let f of this.functions) {
            if (f.getName() === name) {
                try {
                    return f.evaluate(a, b).toString();
                } catch (e) {
                    return "Can't do this operation";
                }
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
        let x: number = -1
        let y: number = -1
        for (let i = 0; i < this.functions.length; i++) {
            if (this.functions[i].getName() === prevName) {
                x = i;
            }
            if (this.functions[i].getName() === newName) {
                y = i;
            }
        }
        if (x < 0) {
            return false;
        }
        if (y < 0) {
            this.functions[x].setName(newName);
            for (let f of this.functions) {
                f.setCode(f.getCode().replace(new RegExp(prevName, 'g'), newName));
            }
            return true;
        }
        return false;
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
        for (let name of this.funcNames) {
            if (name === functionName) {
                if (this.numberList.indexOf(a) < 0 || this.numberList.indexOf(b) < 0) {
                    return "Numbers have to be available";
                }
                const r: string = this.functionDatabase.callFunction(name, a, b);
                if (!Number.isInteger(Number(r))) {
                    return r;
                }
                const n: number = Number(r);
                if (this.numberList.indexOf(n) < 0) {
                    this.numberList.push(n);
                }
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

    public getFunctionNameStr(): string {
        let ret: string = "";
        for (let name of this.funcNames) {
            ret += name + "\n";
        }
        return ret;
    }

    public renameFunction(prevName: string, newName: string): boolean {
        let x: number = -1;
        let y: number = -1;
        for (let i = 0; i < this.funcNames.length; ++i) {
            if (this.funcNames[i] === prevName) {
                x = i;
            }
            if (this.funcNames[i] === newName) {
                y = i;
            }
        }
        if (x < 0) {
            return false;
        }
        if (y < 0) {
            this.funcNames[x] = newName;
        }
        return true;
    }

    public getTarget(): number {
        return this.target;
    }
}


function add(a: number, b: number): number {
    let result: number = 0;

    if (a > 0) {
        for (let i = 0; i < a; ++i) {
            result = result + 1;
        }
    } else {
        for (let i = 0; i < -a; ++i) {
            result = result - 1;
        }
    }

    if (b > 0) {
        for (let i = 0; i < b; ++i) {
            result = result + 1;
        }
    } else {
        for (let i = 0; i < -b; ++i) {
            result = result - 1;
        }
    }
    return result;
}

function sub(a: number, b: number): number {
    let result: number = 0;

    if (a > b) {
        for (let i = b; i < a; ++i) {
            result = result + 1
        }
    } else {
        for (let i = a; i < b; ++i) {
            result = result - 1
        }
    }
    return result;
}

function factorial(a: number, b: number): number {
    let result: number = 1

    if (a > 0) {
        for (let i = 1; i <= a + b + 1; ++i) {
            result = result * i;
        }
    } else {
        for (let i = 1; i <= b - a + 1; ++i) {
            result = result / i;
        }
    }

    if (b > 0) {
        for (let i = a + 1; i <= a + b + 1; ++i) {
            result = result / i;
        }
    } else {
        for (let i = 1; i <= a - b + 1; ++i) {
            result = result * i;
        }
    }

    return result;
}

function gcd(a: number, b: number): number {
    let result: number = 0;
    if (a % 2 == 0 && b % 2 == 0) {
        for (let i: number = 2; i < a + 1; ++i) {
            if (a % i == 0 && b % i == 0) result = i;
        }
    } else {
        for (let i: number = 1; i < a + 1; i += 2) {
            if (a % i == 0 && b % i == 0) result = i;
        }
    }
    return result;
}

function mul(a: number, b: number): number {
    let result: number = 0;
    for (let i: number = 0; i < b; ++i) {
        for (let j: number = 0; j < a; ++j) {
            result = result + 1;
        }
    }
    return result;
}

function isPrime(a: number, b: number): number {
    if (a == 1) return 0;
    let temp: number = b;
    for (let i: number = 0; i < a + temp; ++i) {
        b = b + a;
    }
    for (let i: number = 2; i < a; ++i) {
        if (a % i == 0) return 0;
    }
    return 1;
}


function concat(a: number, b: number): number {
    if (b == 0) return 10 * a;
    let temp = b;
    let d = 0;
    while (temp != 0) {
        temp = Math.floor(temp / 10);
        ++d;
    }
    let p = 1;
    for (let i = 0; i < d; ++i) {
        p = p * 10;
    }
    return a * p + b;
}

function binaryToDecimal(a: number, b: number): number {
    if (a < 0) {
        for (let i = 0; i < b; ++i) {
            a = a + b;
        }
        throw "Negative number not allowed";
    }
    let result = 0;
    let p = 1;
    while (a != 0) {
        let d = a % 10;
        if (d > 1) throw "Only 0 or 1s are allowed as digits";
        result = result + p * d;
        a = Math.floor(a / 10);
        p *= 2;
    }
    return result;
}


export default class GameManager {
    private readonly levels: Array<Level>;
    private currentLevelIndex: number;
    private readonly functionDatabase: FunctionDatabase;

    public constructor() {
        this.functionDatabase = new FunctionDatabase();

        let addstr: string = "RESULT = 0\nIF A > 0 THEN\n	FOR I = 0 TO A STEP 1\n		RESULT = RESULT + 1\nELSE\n	FOR I = 0 TO -B STEP 1\n		RESULT = RESULT - 1\nIF B > 0 THEN\n	FOR I = 0 TO B\n		RESULT = RESULT + 1\nELSE\n	FOR I = 0 TO -B STEP 1\n		RESULT = RESULT - 1\nRETURN RESULT";
        this.functionDatabase.add(new FunctionObject('GCD', add, addstr));

        let substr: string = "RESULT = 0\nIF A > B THEN\n	FOR I = B TO A STEP 1\n		RESULT = RESULT + 1\nELSE\n	FOR I = A TO B STEP 1\n		RESULT = RESULT - 1\nRETURN RESULT";
        this.functionDatabase.add(new FunctionObject('FACTORIAL', sub, substr));


        let gcdstr: string = "RESULT = 0\nIF A % 2 == 0 AND B % 2 == 0 THEN\n	FOR I = 2 TO A + 1 STEP 1\n		IF A % I == 0 AND B % I == 0 THEN\n			RESULT = I\nELSE\n	FOR I = 1 TO A + 1 STEP 2\n		IF A % I == 0 AND B % I == 0 THEN\n			RESULT = I\nRETURN RESULT";
        this.functionDatabase.add(new FunctionObject('SUB', gcd, gcdstr));

        let mulstr: string = "RESULT = 0\nFOR I = 0 TO B STEP 1\n	FOR J = 0 TO A STEP 1\n		RESULT = RESULT + 1\nRETURN RESULT";
        this.functionDatabase.add(new FunctionObject('FIBONACCI', mul, mulstr));

        let primestr: string = "RESULT = 0\nIF A == 1 THEN\n	RETURN 0\nTEMP = B\nFOR I = 0 TO A + TEMP STEP 1\n	B = B + A\nFOR I = 2 TO A STEP 1\n	IF A % I == 0 THEN\n		RETURN 0\nRETURN 1";
        this.functionDatabase.add(new FunctionObject('LCM', isPrime, primestr));

        let concatstr: string = "IF B == 0 THEN\n	RETURN 10 * A\nTEMP = B\nD = 0\nWHILE TEMP != 0\n	TEMP = TEMP / 10\n	D = D + 1\nP = 1\nFOR I = 0 TO D STEP 1\n	P = P * 10\nRETURN A * P + B";
        this.functionDatabase.add(new FunctionObject('MAX', concat, concatstr));

        let bintodecstr: string = "IF A < 0 THEN\n	FOR I = 0 TO B STEP 1\n		A = A + B\n	ERROR\nRESULT = 0\nP = 1\nWHILE A != 0\n	D = A % 10\n	IF (D > 1) ERROR\n	RESULT = RESULT + P * D\n	A = A / 10\n	P = P * 2\nRETURN RESULT";
        this.functionDatabase.add(new FunctionObject('MIN', binaryToDecimal, bintodecstr));


        this.levels = [];
        this.levels.push(new Level(['GCD', 'FACTORIAL'], [5, 8, 14], this.functionDatabase, 17));
        this.levels.push(new Level(['GCD', 'SUB', 'FIBONACCI'], [2, 5, 7, 10], this.functionDatabase, 3));
        this.levels.push(new Level(['LCM', 'MAX', 'MIN', 'FACTORIAL'], [2], this.functionDatabase, 13));

        this.currentLevelIndex = 0;
    }

    public gameOver(): boolean {
        return this.currentLevelIndex >= this.levels.length;
    }

    public feedCommand(command: string): string {
        if (this.gameOver()) {
            return "";
        }
        if (command === "") {
            return "";
        }
        if (command === "LS") {
            return "Available integers:\n" + this.levels[this.currentLevelIndex].getNumberListStr()
                + "\nAvailable Functions:\n" + this.levels[this.currentLevelIndex].getFunctionNameStr();
        }
        if (command === "MAN") {
            return this.functionDatabase.toString();
        }
        if (command === "HELP") {
            return this.getHelpText();
        }
        if (command === "HELP GAME") {
            return this.getHelpGameText();
        }
        if (command === "HELP LEVEL") {
            return "You are in level #" + (this.currentLevelIndex + 1) + "\n"
                + "Your target number is " + this.levels[this.currentLevelIndex].getTarget()
                + "\n" + "Use LS to see available integers and functions and\n"
                + "Use WHATIS to see implementation details";

        }
        let splitCommand = command.split(" ");
        if (splitCommand.length === 2) {
            if (splitCommand[0] === "WHATIS") {
                return this.functionDatabase.getManPageOfFunction(splitCommand[1]);
            }
        }
        if (splitCommand.length === 3) {
            if (splitCommand[0] === "RENAME") {
                if (splitCommand[2] === "RENAME") {
                    return "Can not change name to keyword RENAME";
                }

                let found: boolean = this.functionDatabase.renameFunction(splitCommand[1], splitCommand[2]);
                if (found) {
                    for (let l of this.levels) {
                        l.renameFunction(splitCommand[1], splitCommand[2]);
                    }
                    return "Function " + splitCommand[1] + " renamed to " + splitCommand[2];
                } else {
                    return "Invalid RENAME";
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
                if (this.gameOver()) {
                    return r + "\n" + "Game Over. Congratulations";
                } else {
                    return r + "\n" + "Progressing to next level. Target is " + this.levels[this.currentLevelIndex].getTarget()
                        + "\n" + "Check available numbers and functions with LS";
                }
            }
            return r;
        }
        return "Unknown command";
    }

    private getHelpGameText(): string {
        let helpText: string = "";

        helpText += "You are excited about this game jam and decide to use some functions from an old project.\n";
        helpText += "However, the labels of the functions have been shuffled and they are behaving strangely.\n";
        helpText += "You experiment with different parameters to try to understand the functions' behavior.\n";

        helpText += "\n" + "* You will start with a handful of integers and functions in each level.\n";
        helpText += "* Only these integers can be passed to this functions as parameters\n";
        helpText += "* Note that: The number 'YOU' pass must be in the list of available integers\n";
        helpText += "* This rule does not apply to functions calling other functions\n";
        helpText += "* You will also be given a target number to reach to pass the level.\n";
        helpText += "* In the process, all return values will be added to the available numbers\n";
        helpText += "* provided in the start of each level to help boost your progress\n";
        helpText += "* You can also rename any function to your liking for convenience\n";
        helpText += "\n" + "Good luck!\n";

        return helpText;
    }

    private getHelpText(): string {
        let ret: string = "";
        ret += "LS : List of available integers and function\n";
        ret += "MAN : List of all functions with implementation\n";
        ret += "WHATIS $FUNCTION_NAME$ : Implementation of specified function\n";
        ret += "RENAME $OLD_NAME$ $NEW_NAME$ : Rename function\n";
        ret += "$FUNCTION_NAME$ $A$ $B$ : Call function with parameters\n";
        ret += "HELP : List of all commands\n";
        ret += "HELP GAME : Introduction to the premise of the game\n";
        ret += "HELP LEVEL : Get current level information\n";

        return ret;
    }

    public getLogo(): string {
        return (
            "██████  ███████ ██████   █████  ███    ███ ███████ ████████ ███████ ██████\n" +
            "██   ██ ██      ██   ██ ██   ██ ████  ████ ██         ██    ██      ██   ██\n" +
            "██████  █████   ██████  ███████ ██ ████ ██ █████      ██    █████   ██████\n" +
            "██      ██      ██   ██ ██   ██ ██  ██  ██ ██         ██    ██      ██   ██\n" +
            "██      ███████ ██   ██ ██   ██ ██      ██ ███████    ██    ███████ ██   ██\n"
        );
    }
}


function main(): void {
    let gm: GameManager = new GameManager();
    console.log(gm.feedCommand("HELP"));
    console.log(gm.feedCommand("MAN"));
    console.log(gm.feedCommand("WHATIS ADD"));
    console.log(gm.feedCommand("RENAME ADD FOO"));
    console.log(gm.feedCommand("MAN"))
    console.log(gm.feedCommand("FOO 2 3"));
    console.log(gm.feedCommand("LS"));
    console.log(gm.feedCommand("FOO 3 10"));
    console.log(gm.feedCommand("FOO 3 7"));
    console.log(gm.feedCommand("LS"));
    console.log(gm.feedCommand("FOO 7 10"));
}

if (typeof require !== 'undefined' && require.main === module) {
    main();
}