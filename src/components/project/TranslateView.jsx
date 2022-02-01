import React, {Component, MouseEventHandler} from "react";

import type {ITranslateInfo} from "@/model/ITranslateInfo";
import {formatDateTime} from "@/Utils";
import MonoText from "@/components/project/MonoText";
import {Button, Intent, TextArea} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import api from "@/api/Api";
import type {IComment} from "@/model/IComment";

import './TranslateView.scss'
import globalStore from "@/stores/GlobalStore";

type Props = {
    translate: ITranslateInfo,
    onClick?: MouseEventHandler
}

type States = {
    showComments: boolean,
    comment: string,
    comments: IComment[]
}

class CommentItem extends Component<{comment: IComment, onDeleted: (comment: IComment) => void}> {
    state = {
        deleteConfirm: false
    }

    render() {
        const {comment} = this.props
        return <div>
            <div>{comment.text}</div>
            <div className="sign">{comment.author} {formatDateTime(comment.dateCreate)} {comment.author === globalStore.info.login && (
                <Button icon={IconNames.TRASH} minimal small
                        intent={this.state.deleteConfirm ? Intent.DANGER : Intent.NONE}
                        text={this.state.deleteConfirm ? 'Sure?' : ''}
                        onClick={this.deleteComment}
                />)}</div>
        </div>
    }

    deleteComment = () => {
        if (!this.state.deleteConfirm) {
            this.setState({deleteConfirm: true})
            return
        }

        api.comments.delete(this.props.comment.id)
            .then(() => {
                this.props.onDeleted(this.props.comment)
            })
    }
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