import React from "react"

import type {ITextResource} from "@/model/ITextResource";

export default function DialogInfo({text}: {text: ITextResource}) {
    if (text.noun) {
        return <>{text.noun.map(n => <img src={'/' + n} alt="noun" />)}</>
    }

    return <>{text.talker}</>
}