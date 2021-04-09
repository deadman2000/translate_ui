import React, {Component} from "react";
import {Button, Spinner} from "@blueprintjs/core";

import api from "@/api/Api";
import Logined from "@/pages/Logined";
import Login from "@/pages/Login";

type States = {
    loading: boolean,
    logined: boolean,
    error: boolean,
}

export default class AuthLoading extends Component<{}, States> {
    componentDidMount() {
        this.setState({
            loading: true,
            error: false
        })
        api.users.me()
            .then(() => this.setState({logined: true}))
            .catch(e => {
                if (e.response.status === 401) {
                    this.setState({logined: false})
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
            return <div className="centered">Error <Button text="Try again" onClick={() => this.load()} minimal /></div>

        if (this.state.logined)
            return <Logined />
        else
            return <Login />
    }
}