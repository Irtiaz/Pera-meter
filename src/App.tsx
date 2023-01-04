import React, {Fragment, useState} from 'react';
import Prompt from "./Components/Prompt";
import GameManager from "./util/engine";

const gameManager = new GameManager();

function App() {

    const [log, setLog] = useState("");

    function handleInput(input: string) {

        if (input === "CLEAR") {
            setLog("");
            return;
        }

        const output = gameManager.feedCommand(input);

        let newLog = log;
        if (log.length !== 0) newLog += '\n';
        newLog += ">>" + input;
        newLog += "\n" + output;

        setLog(newLog);
    }

    return (
        <div className={"crt"}>
            <div className={"scan-bar"}></div>
            {log.length > 0 && log.split("\n").map((l, i) =>
                <Fragment key={"log-" + i}>
                    {l.length === 0 ? <br/> : <div style={{paddingLeft: (2 * countTabs(l)) + "em"}}>{l.trim()}</div>}
                </Fragment>
            )}
            <Prompt handlerFunction={handleInput}/>
        </div>
    );
}

function countTabs(str: string): number {
    let count = 0;
    for (let i = 0; i < str.length; ++i) {
        if (str[i] !== '\t') break;
        ++count;
    }
    return count;
}

export default App;
