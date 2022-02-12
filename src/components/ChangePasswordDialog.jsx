import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import {GlobalStore} from "@/stores/GlobalStore";
import {Button, Classes, Dialog, FormGroup, InputGroup, Intent, Tooltip} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import api from "@/api/Api";
import {toast} from "@/components/AppToaster";

@inject("global")
@observer
export default class ChangePasswordDialog extends Component<{ global?: GlobalStore }> {
    state = {
        password: '',
        passwordConfirm: '',
        showPassword: false,
        disabled: false,
    }

    render() {
        const {showPassword, disabled, password, passwordConfirm} = this.state

        const lockButton = (
            <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`} >
                <Button
                    icon={showPassword ? IconNames.EYE_OPEN : IconNames.EYE_OFF}
                    intent={Intent.WARNING}
                    minimal={true}
                    onClick={this.handleLockClick}
                    disabled={disabled}
                />
            </Tooltip>
        );

        return <Dialog isOpen={this.props.global.changePasswordOpen}
                       onClose={this.close}>
            <div className={Classes.DIALOG_BODY}>
                <FormGroup label="New password" labelFor="password-input">
                    <InputGroup id="password-input"
                                leftIcon={IconNames.KEY}
                                type={showPassword ? "text" : "password"}
                                rightElement={lockButton}
                                disabled={disabled}
                                value={password}
                                onChange={e => this.setState({password: e.target.value})} />
                </FormGroup>
                <FormGroup label="Confirm password" labelFor="password-confirm">
                    <InputGroup id="password-confirm"
                                leftIcon={IconNames.KEY}
                                type={showPassword ? "text" : "password"}
                                disabled={disabled}
                                value={passwordConfirm}
                                onChange={e => this.setState({passwordConfirm: e.target.value})} />
                </FormGroup>
            </div>

            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button intent={Intent.PRIMARY} text="CHANGE" onClick={this.changePassword}/>
                    <Button text="CANCEL" onClick={this.close}/>
                </div>
            </div>
        </Dialog>
    }

    close = () => {
        this.setState({password: ''})
        this.props.global.setChangePassword(false)
    }

    changePassword = () => {
        this.setState({disabled: true})

        api.users.changePassword(this.state.password)
            .then(() => {
                toast("Password changed")
                this.setState({password: ''})
                this.close()
            })
            .finally(() => this.setState({disabled: false}))
    }

    handleLockClick = () => this.setState({ showPassword: !this.state.showPassword })
}