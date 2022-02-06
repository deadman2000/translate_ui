import React, {Component} from "react";
import {Button, Intent, TextArea} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {inject} from "mobx-react";

import api from "@/api/Api";
import type {ITextsResponse} from "@/model/ITextsResponse";
import type {ITranslateInfo} from "@/model/ITranslateInfo";
import {GlobalStore} from "@/stores/GlobalStore";
import {toast} from "@/components/AppToaster";
import {TranslateView} from "@/components/project/TranslateView";

type Props = {
    global?: GlobalStore,
    text: ITextsResponse,
    translate?: ITranslateInfo,
    activated?: boolean,
    onCancel?: () => void,
    onSubmit?: (translate: ITranslateInfo) => void,
    onDeleted?: () => void
}

type States = {
    text: string,
    loading: boolean,
    stored: boolean,
    activated: boolean,
    tr: ITranslateInfo,
    deletePressed: boolean,
}

@inject("global")
export class TranslateEditor extends Component<Props, States> {
    timeoutStore = null

    constructor(props: Props) {
        super(props);

        const tr = props.translate
        const s = props.text.source

        this.storeKey = tr ? `translate_${tr.id}` : `${s.project}/${s.volume}/${s.number}`
        const stored = localStorage.getItem(this.storeKey)

        this.state = {
            text: stored ? stored : (tr ? tr.text : ''),
            loading: false,
            stored: !!stored,
            activated: false,
            tr: tr,
            deletePressed: false,
        }
    }

    render() {
        if (this.props.activated || this.state.activated || this.state.stored)
            return (<>
                <div>
                    <TextArea fill growVertically
                              value={this.state.text}
                              onChange={this.onTextChange}
                    />
                </div>
                <div style={{marginTop: 4}}>
                    <Button text="SUBMIT"
                            intent={this.state.stored ? Intent.PRIMARY : undefined}
                            loading={this.state.loading}
                            onClick={this.submit}/>
                    <Button text="Cancel"
                            intent={Intent.WARNING}
                            loading={this.state.loading}
                            onClick={this.cancel}/>
                    {this.props.translate && <>
                    <Button intent={Intent.DANGER}
                            onClick={this.deleteClick}
                            loading={this.state.loading}
                            text={this.state.deletePressed ? "Sure?" : "Delete"}/>
                    <Button icon={IconNames.HISTORY} minimal
                            onClick={this.openHistory} />
                    </>}
                </div>
            </>);

        if (this.state.tr)
            return <TranslateView translate={this.state.tr} onClick={this.inactiveClick} />

        return <></>
    }

    get isRevert() {
        if (!this.state.text) return true
        return this.state.tr && this.state.tr.text === this.state.text;
    }

    inactiveClick = () => {
        this.setState({activated: true})
    }

    onTextChange = e => {
        this.setState({text: e.target.value})

        clearTimeout(this.timeoutStore)
        this.timeoutStore = setTimeout(this.storeText, 1000)
    }

    storeText = () => {
        if (this.isRevert) {
            localStorage.removeItem(this.storeKey)
            this.setState({stored: false})
            return
        }

        localStorage.setItem(this.storeKey, this.state.text)
        this.setState({stored: true})
    }

    submit = () => {
        if (this.isRevert) {
            localStorage.removeItem(this.storeKey)
            this.setState({
                stored: false,
                activated: false
            })
            return
        }

        this.submitText(this.state.text)
    }

    submitOriginal() {
        if (this.state.text) {
            toast('Input field is not empty. This is miss-click?')
            return
        }
        this.submitText(this.props.text.source.text)
    }

    submitText(text: string) {
        this.setState({loading: true})
        const tr = this.state.tr
        const s = this.props.text.source

        api.translate.submit({
            project: s.project,
            volume: s.volume,
            number: s.number,
            translateId: tr ? tr.id : null,
            text: text
        })
            .then(info => {
                localStorage.removeItem(this.storeKey)
                this.storeKey = `translate_${info.id}`
                this.setState({
                    stored: false,
                    tr: info,
                    activated: false
                })
                if (this.props.onSubmit)
                    this.props.onSubmit(info)
            })
            .finally(() => this.setState({loading: false}))
    }

    cancel = () => {
        clearTimeout(this.timeoutStore)
        localStorage.removeItem(this.storeKey)
        const t = this.state.tr
        this.setState({
            stored: false,
            text: t ? t.text : '',
            activated: false
        })

        if (this.props.onCancel)
            this.props.onCancel()
    }

    deleteClick = () => {
        if (this.state.deletePressed) {
            this.delete()
        } else {
            this.setState({deletePressed: true})
        }
    }

    delete() {
        this.setState({loading: true})

        api.translate.delete(this.state.tr.id)
            .then(() => {
                toast("Translate removed")
                if (this.props.onDeleted)
                    this.props.onDeleted()
            })
            .finally(() => this.setState({loading: false}))
    }

    openHistory = () => {
        api.translate.history(this.state.tr.id)
            .then(list => this.props.global.showHistory(list))
    }
}