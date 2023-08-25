import {GlobalStore} from "@/stores/GlobalStore"
import {inject} from "mobx-react"
import React from "react";
import {withRouter} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import {Switch} from "@blueprintjs/core";

import api from "@/api/Api";
import type {IVolume} from "@/model/IVolume";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";
import {VolumeRow} from "@/components/project/VolumeRow";

import './Volumes.scss'

type States = {
    volumes: IVolume[],
    showCompleted: boolean,
    showApproved: boolean
}

@withRouter
@inject("global")
export default class VolumesListPage extends LoaderComponent<{ global?: GlobalStore } & RouteProps, States> {
    get project() {
        return this.props.global.project.code
    }

    prepare(): Promise {
        this.setState({
            showCompleted: localStorage.getItem('showCompleted') === 'true',
            showApproved: localStorage.getItem('showApproved') === 'true'
        })

        return api.project(this.project).volumes()
            .then(volumes => {
                this.setState({volumes})
            })
    }

    needShowVolume(vol: IVolume): boolean {
        const {showCompleted, showApproved} = this.state
        if (vol.translatedTexts !== vol.texts) return true // Незваершенную главу показываем в любом случае
        if (!showCompleted) return false

        if (vol.approvedTexts !== vol.texts) return true
        return showApproved;
    }

    successRender() {
        const {showCompleted, showApproved, volumes} = this.state

        return <>
            <Container className="pt-2 volumes">
                <div className="pt-2">
                    <Switch inline label="Completed" checked={showCompleted}
                            onChange={() => {
                                localStorage.setItem('showCompleted', !showCompleted)
                                this.setState({showCompleted: !showCompleted})
                            }}
                    />
                    {!!showCompleted && (
                        <Switch inline label="Approved" checked={showApproved}
                                onChange={() => {
                                    localStorage.setItem('showApproved', !showApproved)
                                    this.setState({showApproved: !showApproved})
                                }}
                        />)}
                </div>
                <Table striped>
                    <tbody>
                    {volumes.map(v => this.needShowVolume(v) &&
                        <VolumeRow key={v.name} volume={v} baseUrl={this.props.match.url}/>)}
                    </tbody>
                </Table>
            </Container>
        </>
    }
}