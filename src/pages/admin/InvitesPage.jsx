import React from "react";
import {Container, Table} from "react-bootstrap";
import {Button, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import api from "@/api/Api";
import {formatDateTime} from "@/Utils";
import {toast} from "@/components/AppToaster";
import LoaderComponent from "@/components/LoaderComponent";
import type {IInvite} from "@/model/IInvite";
import DeleteConfirmButton from "@/components/DeleteConfirmButton";

type State = {
    invites: IInvite[]
}

export default class InvitesPage extends LoaderComponent<{}, State> {
    prepare(): Promise {
        return api.invites.list()
            .then((invites) => this.setState({invites}))
    }

    successRender() {
        return <Container>
            <div className="mt-2 mb-2">
                <Button icon={IconNames.PLUS} text="Create" onClick={this.createInvite} intent={Intent.PRIMARY} />
            </div>
            <Table hover>
                <tbody>
                    {this.state.invites.map(i => <tr key={i.id}>
                        <td>{i.code}</td>
                        <td><Button minimal icon={IconNames.CLIPBOARD} onClick={() => this.copyLink(i)} /></td>
                        <td>{i.userCreated}</td>
                        <td>{formatDateTime(i.dateCreate)}</td>
                        <td>{i.activated ? "activated" : ""}</td>
                        <td>{formatDateTime(i.dateActivate)}</td>
                        <td>{i.userActivated}</td>
                        <td><DeleteConfirmButton onConfirm={() => this.deleteInvite(i)} /></td>
                    </tr>)}
                </tbody>
            </Table>
        </Container>
    }

    createInvite = () => {
        api.invites.create()
            .then((invite) => {
                this.state.invites.unshift(invite)
                this.setState({invites: this.state.invites})
            })
    }

    deleteInvite(invite: IInvite) {
        api.invites.delete(invite.id)
            .then(() => {
                const i = this.state.invites.indexOf(invite)
                this.state.invites.splice(i, 1)
                this.setState({invites: this.state.invites})
            })
    }

    copyLink(invite: IInvite) {
        navigator.clipboard.writeText(`${location.origin}/invite/${invite.code}`)
            .then(() => toast('Link copied'))
    }
}
