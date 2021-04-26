import React, {Component} from "react";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import type {ITextsResponse} from "@/model/ITextsResponse";
import {TranslateEditor} from "@/components/project/TranslateEditor";
import MonoText from "@/components/project/MonoText";
import './TranslateRow.scss'
import type {ITranslateInfo} from "@/model/ITranslateInfo";

export default class TranslateRow extends Component<{text: ITextsResponse}, {activated: boolean}> {
    constructor(props) {
        super(props);
        this.state = {
            activated: false,
            translates: props.text.translates
        }
    }

    state = {
        activated: false
    }

    render() {
        const t = this.props.text
        const {translates} = this.state
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
                {this.state.activated &&
                    <TranslateEditor text={t}
                                     activated={this.state.activated}
                                     onCancel={() => this.setState({activated: false})}
                                     onSubmit={this.newSubmitted}
                    />
                }
                {translates && translates.map(tr => (
                    <TranslateEditor key={tr.author}
                                     text={t}
                                     translate={tr}
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
        this.setState({
            translates: list,
            activated: false
        })
    }
}