import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import type {ITextsResponse} from "@/model/ITextsResponse";
import type {ITranslateInfo} from "@/model/ITranslateInfo";
import {TranslateEditor} from "@/components/project/TranslateEditor";
import MonoText from "@/components/project/MonoText";
import DialogInfo from "@/components/project/DialogInfo";

import './TranslateRow.scss'
import api from "@/api/Api";

type Props = {
    text: ITextsResponse
}

type States = {
    activated: boolean,
    translates: ITranslateInfo[],
    approvedByMe: boolean,
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
        const {activated, translates, approvedByMe} = this.state
        const approved = approvedByMe !== undefined ? approvedByMe : t.source.translateApproved

        return <tr id={"t"+t.source.number}>
            <td className="col-num"><Link to={`${t.source.volume}#t${t.source.number}`}>{t.source.number}</Link></td>
            <td className="col-dialog"><DialogInfo text={t.source} /></td>
            <td className="col-source-text"><MonoText text={t.source.text}/></td>
            <td className="col-splitter">
                <Button icon={this.state.activated ? IconNames.DOUBLE_CHEVRON_RIGHT : IconNames.CHEVRON_RIGHT}
                        minimal fill
                        onClick={() => {
                            if (this.state.activated) {
                                this.editor.submitOriginal()
                            } else {
                                this.setState({activated: true})
                            }
                        }}
                />
            </td>
            <td className="col-translate-text">
                {activated &&
                    <TranslateEditor text={t}
                                     ref={el => this.editor = el}
                                     activated={true}
                                     onCancel={() => this.setState({activated: false})}
                                     onSubmit={this.newSubmitted}
                    />
                }
                {translates && translates.map(tr => (
                    <TranslateEditor key={tr.id}
                                     text={t}
                                     translate={tr}
                                     onDeleted={(newTr) => this.replaceTranslate(tr, newTr)}
                                     onSubmit={(newTr) => this.replaceTranslate(tr, newTr)}
                    />
                ))}
            </td>
            <td className="col-approve">
                {translates &&
                    <Button
                        icon={approved ? IconNames.TICK_CIRCLE : IconNames.TICK}
                        intent={approved ? Intent.SUCCESS : Intent.NONE}
                        minimal
                        onClick={this.approveClick}
                    />
                }
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

    replaceTranslate(tr: ITranslateInfo, newTr: ITranslateInfo) {
        const {translates} = this.state
        const ind = translates.indexOf(tr)
        if (ind < 0) return

        if (newTr) {
            translates[ind] = newTr
        } else {
            translates.splice(ind, 1)
        }
        this.setState({translates})
    }

    approveClick = () => {
        const {approvedByMe, translates} = this.state
        if (!translates) return
        const approved = !(approvedByMe !== undefined ? approvedByMe : this.props.text.source.translateApproved)

        api.translate.approve(translates[0].id, approved)
            .then(() => this.setState({approvedByMe: approved}))
    }
}