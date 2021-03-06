import React, {Component} from "react";
import {Button, Card, FormGroup, H1, InputGroup, Intent, Tooltip} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import './Login.scss'

export default class Login extends Component<{}> {
    state = {
        showPassword: false,
        login: "",
        password: "",
        disabled: false
    }

    render() {
        const {showPassword} = this.state

        const lockButton = (
            <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`} >
                <Button
                    icon={showPassword ? IconNames.EYE_OPEN : IconNames.EYE_OFF}
                    intent={Intent.WARNING}
                    minimal={true}
                    onClick={this.handleLockClick}
                    disabled={this.state.disabled}
                />
            </Tooltip>
        );

        return <Card className="login-form">
            <form onSubmit={this.handleSubmit}>
                <H1>Login</H1>

                <FormGroup label="Username" labelFor="login-input">
                    <InputGroup id="login-input"
                                leftIcon={IconNames.USER}
                                disabled={this.state.disabled}
                                value={this.state.login}
                                onChange={e => this.setState({login: e.target.value})}
                    />
                </FormGroup>

                <FormGroup label="Password" labelFor="password-input">
                    <InputGroup id="password-input"
                                leftIcon={IconNames.KEY}
                                type={showPassword ? "text" : "password"}
                                rightElement={lockButton}
                                disabled={this.state.disabled}
                                value={this.state.password}
                                onChange={e => this.setState({password: e.target.value})} />
                </FormGroup>

                <div className="bottom">
                    <Button text="SUBMIT"
                            intent={Intent.PRIMARY}
                            type="submit"
                            loading={this.state.disabled}
                            outlined />
                </div>
            </form>
        </Card>
    }

    handleLockClick = () => this.setState({ showPassword: !this.state.showPassword })

    handleSubmit = (event) => {
        const {login, password} = this.state

        this.setState({disabled: true})

        api.users.auth(login, password)
            .then(() => location.reload())
            .finally(() => this.setState({disabled: false}))

        event.preventDefault()
        return false
    }
}