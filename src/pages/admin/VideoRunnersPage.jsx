import React from "react";
import LoaderComponent from "@/components/LoaderComponent";
import api from "@/api/Api";
import {Container} from "react-bootstrap";
import type {IRunner} from "@/model/IRunner";
import {RunnersTable} from "@/components/videos/RunnersTable";

type States = {
    runners: IRunner[]
}

export default class VideoRunnersPage extends LoaderComponent<{}, States> {
    prepare(): Promise {
        return api.video.runners().then((runners) => this.setState({runners}))
    }

    successRender() {
        return <Container>
            <RunnersTable runners={this.state.runners} onDelete={this.deleteRunner}/>
        </Container>
    }

    deleteRunner = (runner: IRunner) => {
        api.video.deleteRunner(runner)
            .then(() => {
                const i = this.state.runners.indexOf(runner)
                this.state.runners.splice(i, 1)
                this.setState({runners: this.state.runners})
            })
    }
}