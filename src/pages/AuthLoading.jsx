import React, {Component} from "react";
import {Button, Card, H2, Icon, Intent, Spinner} from "@blueprintjs/core";

import api from "@/api/Api";
import type {IMyInfo} from "@/model/IMyInfo";
import Logined from "@/pages/Logined";
import Login from "@/pages/Login";
import {IconNames} from "@blueprintjs/icons";

type States = {
    info: IMyInfo,
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
                this.setState({
                    loggedIn: true,
                    info
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
            return <Logined user={this.state.info} />
        else
            return <Login />
    }
}