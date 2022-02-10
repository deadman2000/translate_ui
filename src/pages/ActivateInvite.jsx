import api from "@/api/Api";
import {toastError} from "@/components/AppToaster";
import type {RouteProps} from "@/types/RouteProps";
import {Button, Card, FormGroup, H2, H3, Icon, InputGroup, Intent, Spinner, Tooltip} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import './Login.scss'

@withRouter
export default class ActivateInvite extends Component<RouteProps<{code: string}>> {
    state = {
        loading: true,
        valid: false,
        showPassword: false,
        disabled: false,
        login: '',
        password: '',
        passwordConfirm: '',
    }

    componentDidMount() {
        api.invites.isValid(this.props.match.params.code)
            .then((valid) => this.setState({valid}))
            .catch(() => this.setState({valid: false}))
            .finally(() => this.setState({loading: false}))
    }

    render() {
        const {loading, valid} = this.state

        if (loading)
            return <div className="centered"><Spinner /></div>

        if (!valid)
            return <Card className="login-form">
                <H3><Icon icon={IconNames.WARNING_SIGN} intent={Intent.DANGER} iconSize={40}/> Invite is not valid</H3>
            </Card>

        const {showPassword, disabled, login, password, passwordConfirm} = this.state

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

        return <Card className="login-form">
            <form onSubmit={this.handleSubmit}>
                <H2>Registration</H2>

                <FormGroup label="Username" labelFor="login-input">
                    <InputGroup id="login-input"
                                leftIcon={IconNames.USER}
                                disabled={disabled}
                                value={login}
                                onChange={e => this.setState({login: e.target.value})}
                    />
                </FormGroup>

                <FormGroup label="Password" labelFor="password-input">
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

                <div className="bottom">
                    <Button text="SUBMIT"
                            intent={Intent.PRIMARY}
                            type="submit"
                            loading={disabled}
                            outlined />
                </div>
            </form>
        </Card>
    }

    handleLockClick = () => this.setState({ showPassword: !this.state.showPassword })

    handleSubmit = (event) => {
        const code = this.props.match.params.code
        const {login, password, passwordConfirm} = this.state

        if (password !== passwordConfirm) {
            toastError('Password & confirmation do not match')
            return
        }

        this.setState({disabled: true})

        api.invites.activate({
            code,
            login,
            password
        })
            .then(() => location.reload())
            .finally(() => this.setState({disabled: false}))

        event.preventDefault()
        return false
    }
}