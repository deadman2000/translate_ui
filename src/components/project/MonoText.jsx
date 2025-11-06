import type {ISpellResult} from "@/model/ISpellResult"
import {SpellText} from "@/pages/projects/spellcheck/SpellText"
import globalStore from "@/stores/GlobalStore"
import {observer} from "mobx-react"
import React, {MouseEventHandler} from "react";
import './MonoText.scss'

type Props = {
    text: string,
    id?: string,
    spells?: ISpellResult[],
    onClick?: MouseEventHandler
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export const MonoText = observer(({text, id, spells, onClick}: Props) => {
    if (globalStore.nonPrintShow) {
        const html = escapeHtml(text).replaceAll(/( )/g, '<span class="dot"> </span>')
        return <pre dangerouslySetInnerHTML={{__html: html}}
                    className="mono-text"
                    onClick={onClick}/>
    }

    if (spells) {
        return <pre className="mono-text"
                    onClick={onClick}><SpellText id={id} text={text} spells={spells}/></pre>
    }

    return <pre className="mono-text"
                onClick={onClick}>{text}</pre>
})