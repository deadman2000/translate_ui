import React, {Component} from "react";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import type {ITextsResponse} from "@/model/ITextsResponse";
import {TranslateEditor} from "@/components/project/TranslateEditor";
import MonoText from "@/components/project/MonoText";
import type {ITranslateInfo} from "@/model/ITranslateInfo";
import './TranslateRow.scss'

type Props = {
    text: ITextsResponse
}

type States = {
    activated: boolean,
    translates: ITranslateInfo[]
}

export default class TranslateRow extends Component<Props, States> {
    constructor(props: Props) {
        super(props);

        const s = props.text.source
        this.storeKey = `${s.project}/${s.volume}/${s.number}`
        const stored = localStorage.getItem(this.storeKey)

        this.state = {
            activated: !!stored,
            translates: props.text.translates
        }
    }

    state = {
        activated: false
    }

    render() {
        const t = this.props.text
        const {activated, translates} = this.state
        return <tr id={"t"+t.source.number}>
            <td className="num">{t.source.number}</td>
            <td className="source-text"><MonoText text={t.source.text}/></td>
            <td className="splitter">
                <Button icon={IconNames.CHEVRON_RIGHT}
                        minimal fill
                        onClick={() => this.setState({activated: true})}
                />
            </td>
            <td className="translate-text">
                {activated &&
                    <TranslateEditor text={t}
                                     activated={true}
                                     onCancel={() => this.setState({activated: false})}
                                     onSubmit={this.newSubmitted}
                    />
                }
                {translates && translates.map(tr => (
                    <TranslateEditor key={tr.id}
                                     text={t}
                                     translate={tr}
                                     onDeleted={() => this.removeTranslate(tr)}
                    />
                ))}
            </td>
        </tr>
    }

    newSubmitted = (info: ITranslateInfo) => {
        const {translates} = this.state

        const list = []
        list.push(info)
        if (translates)
            list.push(...translates)
        console.log(list)
        this.setState({
            translates: list,
            activated: false
        })
    }

    removeTranslate(tr: ITranslateInfo) {
        const {translates} = this.state
        const ind = translates.indexOf(tr)
        if (ind > -1) {
            translates.splice(ind, 1)
            this.setState({translates})
        }
    }
}