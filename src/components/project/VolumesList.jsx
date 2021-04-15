import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import {H2, Intent, ProgressBar} from "@blueprintjs/core";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";

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
export default class VolumesList extends LoaderComponent<{project: IProject} & RouteProps, States> {
    prepare(): Promise {
        return api.project(this.props.project.code).volumes()
            .then(volumes => this.setState({volumes}))
    }

    successRender() {
        return <>
            <H2>Volumes</H2>
            <Container>
                <Table striped bordered>
                    <tbody>
                        {this.state.volumes.map(v => <VolumeRow key={v.name} volume={v} baseUrl={this.props.match.url} />)}
                    </tbody>
                </Table>
            </Container>
        </>
    }
}