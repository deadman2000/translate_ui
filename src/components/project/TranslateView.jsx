import api from "@/api/Api";
import {CommentItem} from "@/components/project/CommentItem";
import MonoText from "@/components/project/MonoText";
import type {IComment} from "@/model/IComment";

import type {ITranslateInfo} from "@/model/ITranslateInfo";
import {formatDateTime} from "@/Utils";
import {Button, TextArea} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import React, {Component, MouseEventHandler} from "react";

import './TranslateView.scss'

type Props = {
    translate: ITranslateInfo,
    onClick?: MouseEventHandler
}

type States = {
    showEditor: boolean,
    comment: string,
    comments: IComment[]
}

export class TranslateView extends Component<Props, States> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showEditor: false,
            comment: '',
            comments: props.translate.comments,
        }
    }

    render() {
        const tr = this.props.translate
        return <>
            <MonoText text={tr.text} onClick={this.props.onClick}/>
            <div className="sign">{tr.author} {formatDateTime(tr.dateCreate)} <Button icon={IconNames.COMMENT} minimal small onClick={this.commentClick} /></div>
            {(this.state.showEditor || !!tr.comments.length) && (<div className="comments-block">
                {this.state.comments.map((c) => <CommentItem key={c.id} comment={c} onDeleted={this.onDeletedComment} />)}
                {this.state.showEditor && (
                    <div style={{display: "flex"}}>
                        <TextArea fill small autoFocus
                                  value={this.state.comment}
                                  onChange={this.onTextChange}
                                  onKeyDown={this.commentKeyDown}
                        />
                        <Button icon={IconNames.SEND_MESSAGE}
                                style={{margin: 0}} outlined
                                onClick={this.sendComment} />
                    </div>
                )}
            </div>)}
        </>
    }

    commentClick = () => {
        this.setState({showEditor: !this.state.showEditor})
    }

    onTextChange = (e) => {
        this.setState({comment: e.target.value})
    }

    sendComment = () => {
        const text = this.state.comment.trim()
        if (!text) return

        api.comments.submit({translateId: this.props.translate.id, text})
            .then((comment) => {
                this.state.comments.push(comment)
                this.setState({
                    comments: this.state.comments,
                    comment: '',
                    showEditor: false
                })
            })
    }

    commentKeyDown = (e) => {
        if (e.ctrlKey && e.keyCode === 13)
            this.sendComment()
    }

    onDeletedComment = (comment: IComment) => {
        const i = this.state.comments.indexOf(comment)
        this.state.comments.splice(i, 1)
        this.setState({comments: this.state.comments})
    }
}