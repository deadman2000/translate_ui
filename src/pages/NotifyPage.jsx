import React from "react";
import LoaderComponent from "@/components/LoaderComponent";
import api from "@/api/Api";
import type {ICommentNotify} from "@/model/ICommentNotify";
import {Table} from "react-bootstrap";
import {formatDateTime} from "@/Utils";
import {withRouter} from "react-router-dom";
import type {RouteProps} from "@/types/RouteProps";

import './NotifyPage.scss'

type States = {
    notifies: ICommentNotify[]
}

@withRouter
export default class NotifyPage extends LoaderComponent<RouteProps, States> {
    prepare() {
        return api.notify.list().then(notifies => {
            this.setState({notifies})
            if (notifies.filter(n => !n.read)) {
                setTimeout(this.markRead, 2000)
            }
        })
    }

    successRender() {
        return <div className="content notifies">
            <Table>
                <tbody style={{cursor: "pointer"}}>
                {this.state.notifies.map(n => <tr key={n.id} /*onClick={() => this.openComment(n)}*/ className={n.read ? "read" : "notread"}>
                    <td className="col1">
                        <a href={`/projects/${n.project}/volumes/${n.volume}#t${n.number}`}>
                            <div>{n.project}</div>
                            <div>{n.volume} : {n.number}</div>
                        </a>
                    </td>
                    <td>
                        <a href={`/projects/${n.project}/volumes/${n.volume}#t${n.number}`}>
                            <div>{n.text}</div>
                            <div className="sign">
                                <span>{n.author} {formatDateTime(n.date)}</span>
                            </div>
                        </a>
                    </td>
                </tr>)}
                </tbody>
            </Table>
        </div>
    }

    openComment(notify: ICommentNotify) {
        this.props.history.push(`/projects/${notify.project}/volumes/${notify.volume}#t${notify.number}`)
    }

    markRead = () => {
        api.notify.markRead()
            .then(() => {
                this.state.notifies.forEach(n => n.read = true)
                this.setState({
                    notifies: this.state.notifies
                })
            })
    }

}