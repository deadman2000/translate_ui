import api from "@/api/Api"
import {Button} from "@blueprintjs/core"
import React, {useState} from "react"
import type {ISpellResult} from "@/model/ISpellResult"
import {Classes, Popover2} from "@blueprintjs/popover2"
import "./Spellcheck.scss"

function Spell(props: {id: string, word: string, suggests: string[]}) {
    const [skipped, setSkipped] = useState(false)
    if (skipped)
        return props.word

    return <Popover2
        interactionKind="hover"
        popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
        placement="bottom"
        content={<>
            {props.suggests.map((s) => <p key={s}>{s}</p>)}
            <p><Button text="Skip" onClick={(e) => {
                api.spellcheck.skip(props.id, props.word)
                    .then(() => setSkipped(true))
                e.stopPropagation()
            }} /></p>
        </>}
    >
        <span className="spell">{props.word}</span>
    </Popover2>
}

export function SpellText(props: { id: string, text: string, spells: ISpellResult[] }) {
    if (!props.spells) return props.text

    let text = props.text
    let i = 0
    const items = []
    for (const item of props.spells.slice().reverse()) {
        const rightInd = item.pos + item.len
        const right = text.substring(rightInd)
        text = text.substring(0, item.pos)

        if (right) items.push(<React.Fragment key={i}>{right}</React.Fragment>)
        i++
        items.push(<Spell id={props.id} key={i} word={item.word} suggests={item.s}/>)
        i++
    }
    if (text) items.push(<React.Fragment key={i}>{text}</React.Fragment>)
    items.reverse()

    return items
}