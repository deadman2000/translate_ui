import React from "react";
import {withRouter} from "react-router-dom";
import {inject} from "mobx-react";
import {Table} from "react-bootstrap";
import {H3} from "@blueprintjs/core";

import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import type {ITextsResponse} from "@/model/ITextsResponse";
import type {IVolume} from "@/model/IVolume";
import {GlobalStore} from "@/stores/GlobalStore";
import LoaderComponent from "@/components/LoaderComponent";
import TranslateRow from "@/components/project/TranslateRow";
import TranslateHistory from "@/components/project/TranslateHistory";


type R = {
    project: string,
    volume: string
}

type States = {
    volume: IVolume,
    texts: ITextsResponse[]
}

@withRouter
@inject("global")
export default class VolumePage extends LoaderComponent<{global?: GlobalStore} & RouteProps<R>, States> {
    prepare() {
        const {project, volume} = this.props.match.params
        const volumeApi = api.project(project).volume(volume)

        const loadVolume = volumeApi.get()
            .then(volume => {
                this.setState({volume})
                this.props.global.setVolume(volume)
            })

        const loadTexts = volumeApi.texts()
            .then(texts => this.setState({texts}))

        return Promise.all([loadVolume, loadTexts])
    }

    componentWillUnmount() {
        this.props.global.setVolume({})
    }

    successRender() {
        return <>
            <TranslateHistory />
            <H3>{this.state.volume.name}</H3>
            <Table striped bordered className="text-table">
                <tbody>
                    {this.state.texts.map(t => <TranslateRow key={t.source.number} text={t} />)}
                </tbody>
            </Table>
        </>
    }
}