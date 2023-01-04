import React, {Component, MouseEventHandler} from "react";
import {inject} from "mobx-react";
import {Button, TextArea} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import {GlobalStore} from "@/stores/GlobalStore";
import {CommentItem} from "@/components/project/CommentItem";
import MonoText from "@/components/project/MonoText";
import type {IComment} from "@/model/IComment";
import type {ITranslateInfo} from "@/model/ITranslateInfo";
import {formatDateTime} from "@/Utils";

import './TranslateView.scss'

type Props = {
    global?: GlobalStore,
    translate: ITranslateInfo,
    onClick?: MouseEventHandler
}

type States = {
    showEditor: boolean,
    comment: string,
    comments: IComment[]
}

@inject("global")
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
        const project = this.props.global.project.code
        const {comments} = this.state
        return <>
            <MonoText text={tr.text} onClick={this.props.onClick}/>
            <div className="sign">
                <a href={`/projects/${project}/byuser/${tr.author}`}>{tr.author}</a>
                <span>{formatDateTime(tr.dateCreate)}</span>
                <Button icon={IconNames.COMMENT} minimal small onClick={this.commentClick} />
                <Button icon={IconNames.HISTORY} minimal small onClick={this.openHistory} />
            </div>
            {(this.state.showEditor || (comments && !!comments.length)) && (<div className="comments-block">
                {comments && comments.map((c) => <CommentItem key={c.id} comment={c} onDeleted={this.onDeletedComment} />)}
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
                const comments = this.state.comments ?? []
                comments.push(comment)
                this.setState({
                    comments,
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

    openHistory = () => {
        api.translate.history(this.props.translate.id)
            .then(list => this.props.global.showHistory(list))
    }
}