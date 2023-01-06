import React, {Fragment} from "react";

const Parser: React.FC<{ str: string, fontFamily?: string }> = ({str, fontFamily}) => {
    return <>
        {str.length > 0 && str.split("\n").map((l, i) =>
            <Fragment key={str + i}>
                {l.length === 0 ? <br/> :
                    <div style={{
                        paddingLeft: (2 * countTabs(l)) + "em",
                        whiteSpace: "pre",
                        fontFamily
                    }}>{l.trim()}</div>}
            </Fragment>
        )}
    </>
}

function countTabs(str: string): number {
    let count = 0;
    for (let i = 0; i < str.length; ++i) {
        if (str[i] !== '\t') break;
        ++count;
    }
    return count;
}

export default Parser;