import React from "react";
import './MonoText.scss'

export default function MonoText({text}: {text: string}) {
    function copyHandler() {
        const txt = window.getSelection().toString()
        navigator.clipboard.writeText(txt.replaceAll('·', ' '))
            .then()
    }

    const html = text.replaceAll(' ', '·').replaceAll(/(·+)/g, '<span>$1</span>')
    return <pre dangerouslySetInnerHTML={{__html: html}}
                className="mono-text"
                onCopy={copyHandler}
    />
}