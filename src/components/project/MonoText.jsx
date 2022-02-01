import React, {MouseEventHandler} from "react";
import './MonoText.scss'

export default function MonoText({text, onClick}: {text: string, onClick: MouseEventHandler}) {
    const html = text.replaceAll(/( )/g, '<span> </span>')
    return <pre dangerouslySetInnerHTML={{__html: html}}
                className="mono-text"
                onClick={onClick}
    />
}