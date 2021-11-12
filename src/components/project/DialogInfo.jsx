import React from "react"
import { Tooltip2 } from "@blueprintjs/popover2"

import type {ITextResource} from "@/model/ITextResource";

function DialogInfoTooltip({text}: {text: ITextResource}) {
    return <>
        <div>Talker: {text.talker}</div>
        <div>Verb: {text.verb}</div>
        {text.noun && text.noun.map(n => <div key={n}><img src={'/' + n} alt="noun" /></div>)}
    </>
}

export default function DialogInfo({text}: {text: ITextResource}) {
    return (
        <Tooltip2 content={<DialogInfoTooltip text={text} />}
                  openOnTargetFocus={false}
                  placement="right"
                  usePortal={false}
        >
            {text.talker}
        </Tooltip2>
    )
}