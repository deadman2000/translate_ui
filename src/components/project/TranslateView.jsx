import React, {Component, MouseEventHandler} from "react";

import type {ITranslateInfo} from "@/model/ITranslateInfo";
import {formatDateTime} from "@/Utils";

export class TranslateView extends Component<{translate: ITranslateInfo, onClick?: MouseEventHandler}> {
    render() {
        const tr = this.props.translate
        return <div onClick={this.props.onClick}>
            <pre>{tr.text}</pre>
            <div className="sign">{tr.author} {formatDateTime(tr.dateCreate)}</div>
        </div>
    }
}