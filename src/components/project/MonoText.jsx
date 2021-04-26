import React, {Component} from "react";
import './MonoText.scss'

export default class MonoText extends Component<{text: string}> {
    render() {
        const html = this.props.text.replaceAll(' ', '·').replaceAll(/(·+)/g, '<span>$1</span>')
        return <pre dangerouslySetInnerHTML={{__html: html}}
                    className="mono-text"
                    onCopy={this.copyHandler}
        />
    }

    copyHandler = () => {
        const txt = window.getSelection().toString()
        navigator.clipboard.writeText(txt.replaceAll('·', ' '))
            .then()
    }
}