import user from "@/stores/UserInfo";
import React, {Component} from "react";
import {Button, Card, H2, Icon, Intent, Spinner} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import api from "@/api/Api";
import AuthSwitch from "@/pages/AuthSwitch";
import UnauthSwitch from "@/pages/UnauthSwitch";

type States = {
    loading: boolean,
    loggedIn: boolean,
    error: boolean,
}

export default class AuthLoading extends Component<{}, States> {
    componentDidMount() {
        this.load()
    }

    load() {
        this.setState({
            loading: true,
            error: false
        })
        api.users.me()
            .then(info => {
                user.init(info)
                this.setState({
                    loggedIn: true,
                })
            })
            .catch(e => {
                if (e.response.status === 401) {
                    this.setState({loggedIn: false})
                    return
                }
                this.setState({error: true})
            })
            .finally(() => this.setState({loading: false}))
    }

    render() {
        if (!this.state || this.state.loading)
            return <div className="centered"><Spinner /></div>

        if (this.state.error)
            return <div className="centered">
                <Card>
                    <H2><Icon icon={IconNames.WARNING_SIGN} intent={Intent.DANGER} iconSize={40}/> Error!</H2>
                    <div><Button icon={IconNames.REFRESH} text="Try again" onClick={() => this.load()} minimal /></div>
                </Card>
            </div>

        if (this.state.loggedIn)
            return <AuthSwitch/>
        else
            return <UnauthSwitch/>
    }
}