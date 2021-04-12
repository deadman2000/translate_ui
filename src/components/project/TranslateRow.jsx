import React, {Component} from "react";
import {Button} from "react-bootstrap";
import {TextArea} from "@blueprintjs/core";

import api from "@/api/Api";
import type {ITextResource} from "@/model/ITextResource";
import './TranslateRow.scss'

type States = {
    translate: string,
    loading: boolean
}

export default class TranslateRow extends Component<{text: ITextResource}, States> {
    constructor(props) {
        super(props)
        this.state = {
            translate: props.text.text,
            loading: false
        }
    }

    render() {
        const t = this.props.text
        return <tr>
            <td style={{width: 40}}>{t.number}</td>
            <td className="source-text"><pre>{t.text}</pre></td>
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
                            disabled={this.state.loading}
                    >Cancel</Button>
                    <Button variant="primary"
                            onClick={this.submit}
                            disabled={this.state.loading}
                    >SUBMIT</Button>
                </div>
            </td>
        </tr>
    }

    onTextChange = e => {
        this.setState({translate: e.target.value})
    }

    submit = () => {
        this.setState({loading: true})
        const t = this.props.text

        api.translate.submit({
            project: t.project,
            volume: t.volume,
            number: t.number,
            text: this.state.translate
        })
            .finally(() => this.setState({loading: false}))
    }
}