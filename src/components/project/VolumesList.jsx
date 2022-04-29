import React from "react";
import {withRouter} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import {Switch} from "@blueprintjs/core";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";
import {VolumeRow} from "@/components/project/VolumeRow";

import './Volumes.scss'

type States = {
    volumes: IVolume[],
    showCompleted: boolean
}

@withRouter
export default class VolumesList extends LoaderComponent<{project: IProject} & RouteProps, States> {
    prepare(): Promise {
        this.setState({
            showCompleted: localStorage.getItem('showCompleted') === 'true'
        })

        return api.project(this.props.project.code).volumes()
            .then(volumes => {
                this.setState({volumes})
            })
    }

    successRender() {
        const {showCompleted, volumes} = this.state

        return <>
            <Container className="pt-2">
                <div className="pt-2">
                    <Switch inline label="Show completed" checked={showCompleted}
                            onChange={() => {
                                localStorage.setItem('showCompleted', !showCompleted)
                                this.setState({showCompleted: !showCompleted})
                            }}
                    />
                </div>
                <Table striped>
                    <tbody>
                        {volumes.map(v => (showCompleted || v.translatedTexts !== v.texts) && <VolumeRow key={v.name} volume={v} baseUrl={this.props.match.url} />)}
                    </tbody>
                </Table>
            </Container>
        </>
    }
}