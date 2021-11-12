import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import {H2, Intent, ProgressBar} from "@blueprintjs/core";
import {Tooltip2} from "@blueprintjs/popover2";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";
import {formatDateTime, fromNow} from "@/Utils";
import {inject, observer} from "mobx-react";
import {GlobalStore} from "@/stores/GlobalStore";

type States = {
    volumes: IVolume[]
}

class VolumeRow extends Component<{volume: IVolume, baseUrl: string}> {
    render() {
        const v = this.props.volume
        const url = this.props.baseUrl

        const progress = v.translatedLetters / v.letters

        return <tr key={v.name}>
            <td><Link to={`${url}/${v.code}`}>{v.name}</Link></td>
            <td><Tooltip2 content={formatDateTime(v.lastSubmit)}>{fromNow(v.lastSubmit)}</Tooltip2></td>
            <td style={{width: 100}}>{v.translatedTexts} / {v.texts}</td>
            <td className="align-middle"><ProgressBar
                intent={Intent.PRIMARY}
                stripes={false}
                value={progress}
            /></td>
        </tr>
    }
}

@withRouter
@inject("global")
@observer
export default class VolumesList extends LoaderComponent<{project: IProject, global?: GlobalStore} & RouteProps, States> {
    prepare(): Promise {
        return api.project(this.props.project.code).volumes()
            .then(volumes => this.setState({volumes}))
    }

    successRender() {
        const showCompleted = this.props.global.showCompletedVolumes
        return <>
            <Container className="pt-2">
                <H2>Volumes</H2>
                <Table striped bordered>
                    <tbody>
                        {this.state.volumes.map(v => (showCompleted || v.translatedTexts !== v.texts) && <VolumeRow key={v.name} volume={v} baseUrl={this.props.match.url} />)}
                    </tbody>
                </Table>
            </Container>
        </>
    }
}