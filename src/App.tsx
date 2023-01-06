import React, {useEffect, useState} from 'react';
import Prompt from "./Components/Prompt";
import GameManager from "./util/engine";
import TypeIt from "typeit-react";
import Parser from "./Components/Parser";

const gameManager = new GameManager();
let interval: NodeJS.Timer;

function App() {

    const [log, setLog] = useState("");

    const [firstComplete, setFirstComplete] = useState(false);
    const [secondComplete, setSecondComplete] = useState(false);
    const [thirdComplete, setThirdComplete] = useState(false);
    const [showInitialStuff, setShowInitialStuff] = useState(true);
    const [skippedCutscene, setSkippedCutscene] = useState(false);

    function handleInput(input: string) {
        if (gameManager.gameOver()) return;

        if (input === "CLEAR") {
            if (showInitialStuff) {
                console.log({firstComplete, secondComplete, thirdComplete, showInitialStuff})
                setShowInitialStuff(false);
            }
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

    useEffect(() => {
        document.body.onkeydown = () => {
            setSkippedCutscene(true);
            setLog(
                ">>HELP GAME\n\n" + gameManager.feedCommand("HELP GAME") +
                ">>HELP\n\n" + gameManager.feedCommand("HELP") +
                ">>HELP LEVEL\n\n" + gameManager.feedCommand("HELP LEVEL")
            );
        }
    }, []);


    return (
        <div className={"crt"}>
            <div className={"scan-bar"}></div>

            {showInitialStuff && <Parser str={gameManager.getLogo()} fontFamily={"Consolas"}/>}

            <div style={{display: (showInitialStuff && !skippedCutscene) ? "block" : "none"}}>
                <div>&gt;&gt;HELP GAME</div>

                <TypeIt options={{speed: 10}} getAfterInit={instance => {
                    instance.destroy();

                    interval = setInterval(() => {
                        if (instance.is('completed')) {
                            setFirstComplete(true);
                            clearInterval(interval);
                        }
                    }, 100);

                    return instance;
                }}>
                    <Parser str={gameManager.feedCommand("HELP GAME")}/>
                </TypeIt>

                {firstComplete &&
                    <>
                        <div>&gt;&gt;HELP</div>
                        <TypeIt options={{speed: 10}} getAfterInit={instance => {
                            instance.destroy();
                            interval = setInterval(() => {

                                if (instance.is('completed')) {
                                    setSecondComplete(true);
                                    clearInterval(interval);
                                }
                            }, 100);
                            return instance;
                        }}>
                            <Parser str={gameManager.feedCommand("HELP")}/>
                        </TypeIt>

                    </>
                }

                {firstComplete && secondComplete &&
                    <>
                        <div>&gt;&gt;HELP LEVEL</div>
                        <TypeIt getAfterInit={instance => {
                            instance.destroy();
                            interval = setInterval(() => {

                                if (instance.is('completed')) {
                                    setThirdComplete(true);
                                    clearInterval(interval);
                                }
                            }, 100);
                            return instance;
                        }}>
                            <Parser str={gameManager.feedCommand("HELP LEVEL")}/>
                        </TypeIt>

                    </>
                }
            </div>


            {(skippedCutscene || (firstComplete && secondComplete && thirdComplete)) &&
                <>
                    <Parser str={log}/>
                    {!gameManager.gameOver() && <Prompt handlerFunction={handleInput}/>}
                </>
            }


        </div>
    );
}


export default App;
