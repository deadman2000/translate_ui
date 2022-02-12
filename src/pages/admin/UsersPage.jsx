import React from "react";
import LoaderComponent from "@/components/LoaderComponent";
import type {IUser} from "@/model/IUser";
import api from "@/api/Api";
import {Container, Table} from "react-bootstrap";
import DeleteConfirmButton from "@/components/DeleteConfirmButton";
import {Button, Classes, Dialog, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {toast} from "@/components/AppToaster";

type State = {
    users: IUser[],
    changePasswordOpen: boolean,
    changePasswordUser: IUser,
    newPassword: string,
}

export default class UsersPage extends LoaderComponent<{}, State>  {
    prepare(): Promise {
        return api.users.list()
            .then((users) => this.setState({users}))
    }

    successRender() {
        return  <Container>
            <Table hover>
                <tbody>
                {this.state.users.map(u => <tr key={u.id}>
                    <td>{u.login}</td>
                    <td>{u.role}</td>
                    <td><Button minimal icon={IconNames.ASTERISK} onClick={() => this.changePasswordClick(u)}/> <DeleteConfirmButton onConfirm={() => this.deleteUser(u)} /></td>
                </tr>)}
                </tbody>
            </Table>
            <Dialog isOpen={this.state.changePasswordOpen}
                    onClose={this.closeChangePassword}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup label="New password" labelFor="password-input">
                        <InputGroup id="password-input"
                                    leftIcon={IconNames.KEY}
                                    value={this.state.newPassword}
                                    onChange={e => this.setState({newPassword: e.target.value})} />
                    </FormGroup>
                </div>

                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button intent={Intent.PRIMARY} text="CHANGE" onClick={this.changeUserPassword}/>
                        <Button text="CANCEL" onClick={this.closeChangePassword}/>
                    </div>
                </div>
            </Dialog>
        </Container>
    }

    deleteUser(user: IUser) {
        api.users.delete(user.id)
            .then(() => {
                const i = this.state.users.indexOf(user)
                this.state.users.splice(i, 1)
                this.setState({users: this.state.users})
            })
    }

    changePasswordClick(user: IUser) {
        this.setState({
            changePasswordOpen: true,
            changePasswordUser: user,
        })
    }

    closeChangePassword = () => {
        this.setState({
            changePasswordOpen: false,
            changePasswordUser: null,
        })
    }

    changeUserPassword = () => {
        const user = this.state.changePasswordUser
        const password = this.state.newPassword
        if (!password) return

        api.users.setPassword(user.id, password)
            .then(() => {
                toast("Password changed")
                this.closeChangePassword()
            })
    }
}