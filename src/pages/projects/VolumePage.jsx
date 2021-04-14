import React from "react";
import {withRouter} from "react-router-dom";
import {Table} from "react-bootstrap";
import {H3} from "@blueprintjs/core";

import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";
import type {ITextsResponse} from "@/model/ITextsResponse";
import type {IVolume} from "@/model/IVolume";
import LoaderComponent from "@/components/LoaderComponent";
import TranslateRow from "@/components/project/TranslateRow";


type R = {
    project: string,
    volume: string
}

type States = {
    volume: IVolume,
    texts: ITextsResponse[]
}

@withRouter
export default class VolumePage extends LoaderComponent<RouteProps<R>, States> {
    prepare() {
        const {project, volume} = this.props.match.params
        const volumeApi = api.project(project).volume(volume)

        const loadVolume = volumeApi.get()
            .then(volume => this.setState({volume}))

        const loadTexts = volumeApi.texts()
            .then(texts => this.setState({texts}))

        return Promise.all([loadVolume, loadTexts])
    }

    successRender() {
        return <>
            <H3>{this.state.volume.name}</H3>
            <Table striped bordered>
                <tbody>
                    {this.state.texts.map(t => <TranslateRow key={t.source.number} text={t} />)}
                </tbody>
            </Table>
        </>
    }
}