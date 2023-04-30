import type {ISpellResult} from "@/model/ISpellResult"
import {SpellText} from "@/pages/projects/spellcheck/SpellText"
import globalStore from "@/stores/GlobalStore"
import {observer} from "mobx-react"
import React, {MouseEventHandler} from "react";
import './MonoText.scss'

type Props = {
    text: string,
    spells: ISpellResult[],
    onClick?: MouseEventHandler
}

export const MonoText = observer(({text, spells, onClick}: Props) => {
    if (globalStore.nonPrintShow) {
        const html = text.replaceAll(/( )/g, '<span class="dot"> </span>')
        return <pre dangerouslySetInnerHTML={{__html: html}}
                    className="mono-text"
                    onClick={onClick}/>
    } else {
        return <pre className="mono-text"
                    onClick={onClick}><SpellText text={text} spells={spells}/></pre>
    }
})