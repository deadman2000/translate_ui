import api from "@/api/Api";
import type {IComment} from "@/model/IComment";
import user from "@/stores/UserInfo";
import {formatDateTime} from "@/Utils";
import {Button, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import React, {Component} from "react";

export class CommentItem extends Component<{ comment: IComment, onDeleted: (comment: IComment) => void }> {
    state = {
        deleteConfirm: false
    }

    render() {
        const {comment} = this.props
        return <div>
            <div className="message">{comment.text}</div>
            <div className="sign">{comment.author} {formatDateTime(comment.dateCreate)} {(user.isAdmin || comment.author === user.login) && (
                <Button icon={IconNames.TRASH} minimal small
                        intent={this.state.deleteConfirm ? Intent.DANGER : Intent.NONE}
                        text={this.state.deleteConfirm ? 'Sure?' : ''}
                        onClick={this.deleteComment}
                        onDoubleClick={this.stopPropagation}
                />)}</div>
        </div>
    }

    stopPropagation = (e) => {
        e.stopPropagation()
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