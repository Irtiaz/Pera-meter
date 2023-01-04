import React, {Fragment, useState} from 'react';
import Prompt from "./Components/Prompt";

function App() {

    const [log, setLog] = useState("");

    function handleInput(input: string) {
        const output = "";

        let newLog = log;
        if (log.length !== 0) newLog += '\n';
        newLog += ">>" + input;
        newLog += "\n" + output;

        console.log({input, newLog});

        setLog(newLog);
    }

    return (
        <div className={"crt"}>
            <div className={"scan-bar"}></div>
            {log.length > 0 && log.split("\n").map((h, i) =>
                <Fragment key={"log-" + i}>
                    {h.length === 0 ? <br/> : <div>{h}</div>}
                </Fragment>
            )}
            <Prompt handlerFunction={handleInput}/>
        </div>
    );
}

export default App;
