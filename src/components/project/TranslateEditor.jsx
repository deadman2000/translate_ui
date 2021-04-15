import React, {Component} from "react";
import {Button, Intent, TextArea} from "@blueprintjs/core";

import api from "@/api/Api";
import type {ITextsResponse} from "@/model/ITextsResponse";
import {toast} from "@/components/AppToaster";
import {TranslateVariant} from "@/components/project/TranslateVariant";

type Props = {
    text: ITextsResponse,
    activated: boolean,
    onCancel: () => void
}

type States = {
    translate: string,
    loading: boolean,
    stored: boolean,
    activated: boolean,
}

export class TranslateEditor extends Component<Props, States> {
    timeoutStore = null

    constructor(props: Props) {
        super(props);

        const t = props.text
        const s = t.source

        this.storeKey = `${s.project}/${s.volume}/${s.number}`
        const stored = localStorage.getItem(this.storeKey)

        this.state = {
            translate: stored ? stored : (t.my ? t.my.text : ''),
            loading: false,
            stored: !!stored,
            activated: false,
        }
    }

    render() {
        if (this.props.activated || this.state.activated || this.state.stored)
            return (<>
                <div>
                    <TextArea fill growVertically
                              value={this.state.translate}
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
                    <Button intent={Intent.DANGER}
                            onClick={this.delete}
                            loading={this.state.loading}
                            text="Delete"/>
                </div>
            </>);

        if (this.props.text.my)
            return <TranslateVariant translate={this.props.text.my} onClick={this.inactiveClick} />

        return <></>
    }

    get isRevert() {
        if (!this.state.translate) return true
        return this.props.text.my && this.props.text.my.text === this.state.translate;
    }

    inactiveClick = () => {
        this.setState({activated: true})
    }

    onTextChange = e => {
        this.setState({translate: e.target.value})

        clearTimeout(this.timeoutStore)
        this.timeoutStore = setTimeout(this.storeText, 1000)
    }

    storeText = () => {
        if (this.isRevert) {
            localStorage.removeItem(this.storeKey)
            this.setState({stored: false})
            return
        }

        localStorage.setItem(this.storeKey, this.state.translate)
        this.setState({stored: true})
    }

    submit = () => {
        if (this.isRevert) {
            localStorage.removeItem(this.storeKey)
            this.setState({stored: false})
            return
        }

        this.setState({loading: true})
        const s = this.props.text.source

        api.translate.submit({
            project: s.project,
            volume: s.volume,
            number: s.number,
            text: this.state.translate
        })
            .then(info => {
                localStorage.removeItem(this.storeKey)
                this.setState({stored: false})
                this.props.text.my = info
            })
            .finally(() => this.setState({loading: false}))
    }

    cancel = () => {
        clearTimeout(this.timeoutStore)
        localStorage.removeItem(this.storeKey)
        const t = this.props.text
        this.setState({
            stored: false,
            translate: t.my ? t.my.text : '',
            activated: false
        })

        this.props.onCancel()
    }

    delete = () => {
        this.setState({loading: true})
        const s = this.props.text.source

        api.translate.delete(s.project, s.volume, s.number)
            .then(() => toast("Translate removed"))
            .finally(() => this.setState({loading: false}))
    }
}