import React from "react";
import './MonoText.scss'

export default function MonoText({text}: {text: string}) {
    const html = text.replaceAll(/( )/g, '<span> </span>')
    return <pre dangerouslySetInnerHTML={{__html: html}}
                className="mono-text"
    />
}