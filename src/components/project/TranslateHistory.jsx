import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Button, Classes, Dialog} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import Diff from 'react-stylable-diff'

import {GlobalStore} from "@/stores/GlobalStore";
import {formatDateTime} from "@/Utils";
import './TranslateHistory.scss'

@inject("global")
@observer
export default class TranslateHistory extends Component<{global?: GlobalStore}> {
    state = {
        diff: true
    }

    render() {
        const hist = this.props.global.currentHistory
        if (!hist || !hist.length) return <></>

        return <Dialog
            isOpen={true}
            title="Translate history"
            onClose={this.handleClose}
        >
            <div className="pt-1 pb-1 pl-3">
                <Button icon={IconNames.CHANGES}
                        minimal outlined
                        active={this.state.diff}
                        onClick={() => this.setState({diff: !this.state.diff})}
                        text="Show diff"
                />
            </div>
            <div className={Classes.DIALOG_BODY}>
                <div className="translate-history-dialog">
                    {hist.map((t, i) => <div key={t.id}>
                        {i === hist.length-1 || !this.state.diff ? <pre>{t.text}</pre> : (
                            <pre><Diff
                                inputA={hist[i+1].text}
                                inputB={t.text}
                                type="chars"
                            /></pre>
                        )}
                        <div className="sign">{t.editor || t.author} {formatDateTime(t.dateCreate)}</div>
                        <hr/>
                    </div>)}
                </div>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={this.handleClose}>Close</Button>
                </div>
            </div>
        </Dialog>
    }

    handleClose = () => {
        this.props.global.hideHistory()
    }
}