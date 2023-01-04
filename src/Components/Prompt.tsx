import React, {useEffect, useRef, useState} from "react";

const Prompt: React.FC<{ handlerFunction(input: string): void }> = ({handlerFunction}) => {

    const [input, setInput] = useState("");
    const [cursorPos, setCursorPos] = useState<number>(0);

    const ref = useRef() as any;

    useEffect(() => {
        document.body.onkeydown = (event) => {
            if (event.key.length === 1) {
                setInput(input.slice(0, cursorPos) + event.key.toLocaleUpperCase() + input.slice(cursorPos + 1));
                setCursorPos(cursorPos + 1);
            } else if (event.key === "Backspace" && cursorPos > 0) {
                const erasePos = cursorPos - 1;
                setInput(input.slice(0, erasePos) + input.slice(erasePos + 1));
                setCursorPos(cursorPos - 1);
            } else if (event.key === "ArrowLeft" && cursorPos > 0) setCursorPos(cursorPos - 1);
            else if (event.key === "ArrowRight" && cursorPos < input.length) setCursorPos(cursorPos + 1);
            else if (event.key === "Enter") {
                handlerFunction(input);
                setInput("");
                setCursorPos(0);
            }
        }
    }, [input, cursorPos, handlerFunction]);

    return (
        <div>
            <span ref={ref}>&gt;&gt;</span>
            <span style={{position: "relative", fontSize: "1rem"}}>
                <span>{input}</span>
                <span style={{
                    position: "absolute",
                    left: input.length === 0 ? 0 : (cursorPos * (ref.current.getBoundingClientRect().width / 2)) + "px"
                }} className={"caret"}>&#9647;</span>
            </span>
        </div>
    );
}

export default Prompt;