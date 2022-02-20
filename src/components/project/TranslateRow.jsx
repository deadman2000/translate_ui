import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {inject, observer} from "mobx-react";

import api from "@/api/Api";
import {GlobalStore} from "@/stores/GlobalStore";
import type {ITextsResponse} from "@/model/ITextsResponse";
import type {ITranslateInfo} from "@/model/ITranslateInfo";
import {TranslateEditor} from "@/components/project/TranslateEditor";
import MonoText from "@/components/project/MonoText";
import DialogInfo from "@/components/project/DialogInfo";

import './TranslateRow.scss'

type Props = {
    text: ITextsResponse,
    global?: GlobalStore
}

type States = {
    activated: boolean,
    translates: ITranslateInfo[],
    approvedByMe: boolean,
}

@inject("global")
@observer
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
            <td className="col-source-text">
                <MonoText text={t.source.text}/>
                {this.props.global.hints && t.refs && (<div className="videos">{t.refs.map(r => (
                        <a href={`https://youtu.be/${r.videoId}?t=${r.t}`} target="_blank">
                            <img src={`/api/resources/videos/${r.videoId}/${r.frame}.png`} alt="frame"/>
                            <div className="labels">{r.rate.toFixed(2)}</div>
                        </a>
                    )
                )}</div>)}
            </td>
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