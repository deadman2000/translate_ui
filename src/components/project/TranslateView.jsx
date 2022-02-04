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
    showComments: boolean,
    comment: string,
    comments: IComment[]
}

export class TranslateView extends Component<Props, States> {
    state: States = {
        showComments: false,
        comment: '',
        comments: []
    }

    render() {
        const tr = this.props.translate
        return <>
            <MonoText text={tr.text} onClick={this.props.onClick}/>
            <div className="sign">{tr.author} {formatDateTime(tr.dateCreate)} <Button icon={IconNames.COMMENT} minimal small onClick={this.commentClick} /></div>
            {this.state.showComments && (<div className="comments-block">
                {this.state.comments.map((c) => <CommentItem key={c.id} comment={c} onDeleted={this.onDeletedComment} />)}
                <div style={{display: "flex"}}>
                    <TextArea fill small
                              value={this.state.comment}
                              onChange={this.onTextChange}
                              onKeyDown={this.commentKeyDown}
                    />
                    <Button icon={IconNames.SEND_MESSAGE}
                            style={{margin: 0}} outlined
                            onClick={this.sendComment} />
                </div>
            </div>)}
        </>
    }

    loadComments() {
        api.comments.byTranslate(this.props.translate.id)
            .then((comments) => {
                this.setState({comments})
            })
    }

    commentClick = () => {
        if (!this.state.showComments && !this.state.comments.length) {
            this.loadComments()
        }
        this.setState({showComments: !this.state.showComments})
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
                    comment: ''
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