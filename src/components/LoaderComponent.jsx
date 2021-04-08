import React, {Component} from "react";
import {Button, Spinner} from "@blueprintjs/core";
import './LoaderComponent.scss'

type States = {
    loading: boolean,
    error: boolean,
}

export default class LoaderComponent<P={},S={}> extends Component<P,S & States> {
    componentDidMount() {
        this.load()
    }

    load() {
        this.setState({
            loading: true,
            error: false
        })
        this.prepare()
            .catch(() => this.setState({error: true}))
            .finally(() => this.setState({loading: false}))
    }

    prepare(): Promise {
        throw new Error("not implemented")
    }

    render() {
        if (!this.state || this.state.loading)
            return <div className="centered"><Spinner /></div>

        if (this.state.error)
            return <div className="centered">Error <Button text="Try again" onClick={() => this.load()} minimal /></div>

        return this.successRender()
    }

    successRender() {
        throw new Error("not implemented")
    }
}