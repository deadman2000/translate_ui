import React, {Component} from "react";
import {Button} from "react-bootstrap";
import {TextArea} from "@blueprintjs/core";

import api from "@/api/Api";
import type {ITextsResponse} from "@/model/ITextsResponse";
import type {ITextTranslate} from "@/model/ITextTranslate";
import {toast} from "@/components/AppToaster";
import './TranslateRow.scss'

type States = {
    translate: string,
    loading: boolean
}

class TranslateVariant extends Component<{translate: ITextTranslate}>{
    render() {
        const tr = this.props.translate
        return <>
            <pre>{tr.text}</pre>
        </>
    }
}

export default class TranslateRow extends Component<{text: ITextsResponse}, States> {
    constructor(props) {
        super(props)

        const t = props.text
        this.state = {
            translate: t.my ? t.my.text : t.source.text,
            loading: false
        }
    }

    render() {
        const t = this.props.text
        return <tr>
            <td style={{width: 40}}>{t.source.number}</td>
            <td className="source-text"><pre>{t.source.text}</pre></td>
            <td className="translate-text">
                <div>
                    <TextArea fill growVertically
                              value={this.state.translate}
                              onChange={this.onTextChange}
                    />
                </div>
                <div style={{textAlign: "right", marginTop: 4}}>
                    <Button variant="danger"
                            style={{marginRight: 16}}
                            onClick={this.delete}
                            disabled={this.state.loading}
                    >Delete</Button>
                    <Button variant="warning"
                            style={{marginRight: 16}}
                            disabled={this.state.loading}
                    >Cancel</Button>
                    <Button variant="primary"
                            onClick={this.submit}
                            disabled={this.state.loading}
                    >SUBMIT</Button>
                </div>
                {t.translates && t.translates.map(tr => <TranslateVariant key={tr.author} translate={tr}/>)}
            </td>
        </tr>
    }

    onTextChange = e => {
        this.setState({translate: e.target.value})
    }

    submit = () => {
        this.setState({loading: true})
        const s = this.props.text.source

        api.translate.submit({
            project: s.project,
            volume: s.volume,
            number: s.number,
            text: this.state.translate
        })
            .finally(() => this.setState({loading: false}))
    }

    delete = () => {
        this.setState({loading: true})
        const s = this.props.text.source

        api.translate.delete(s.project, s.volume, s.number)
            .then(() => toast("Translate removed"))
            .finally(() => this.setState({loading: false}))
    }
}