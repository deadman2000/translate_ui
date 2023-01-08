import globalStore from "@/stores/GlobalStore"
import {observer} from "mobx-react"
import React, {MouseEventHandler} from "react";
import './MonoText.scss'

type Props = {
    text: string,
    onClick?: MouseEventHandler
}

export const MonoText = observer(({text, onClick}: Props) => {
    if (globalStore.nonPrintShow) {
        const html = text.replaceAll(/( )/g, '<span> </span>')
        return <pre dangerouslySetInnerHTML={{__html: html}}
                    className="mono-text"
                    onClick={onClick}/>
    } else {
        return <pre className="mono-text"
                    onClick={onClick}>{text}</pre>
    }
})