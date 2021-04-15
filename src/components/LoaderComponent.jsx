import React, {Component} from "react";
import {Button, Card, H2, Icon, Intent, Spinner} from "@blueprintjs/core";
import './LoaderComponent.scss'
import {IconNames} from "@blueprintjs/icons";

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
            .catch(e => {
                console.error(e)
                this.setState({error: true})
            })
            .finally(() => this.setState({loading: false}))
    }

    prepare(): Promise {
        throw new Error("not implemented")
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

        return this.successRender()
    }

    successRender() {
        throw new Error("not implemented")
    }
}