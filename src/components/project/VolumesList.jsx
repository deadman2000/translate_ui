import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import {H2, Switch} from "@blueprintjs/core";
import {Tooltip2} from "@blueprintjs/popover2";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {IVolume} from "@/model/IVolume";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";
import {formatDateTime, fromNow} from "@/Utils";

type States = {
    volumes: IVolume[],
    showCompleted: boolean
}

class VolumeRow extends Component<{volume: IVolume, baseUrl: string}> {
    render() {
        const v = this.props.volume
        const url = this.props.baseUrl

        const prTranslated = v.translatedLetters / v.letters
        const prTranslatedP = Math.round(prTranslated * 100)
        const prApproved = v.approvedLetters / v.letters
        const prApprovedP = Math.round(prApproved * 100)

        return <tr key={v.name}>
            <td className="min-width"><Link to={`${url}/${v.code}`}>{v.name}</Link></td>
            <td className="min-width">
                {v.lastSubmit && <Tooltip2 content={formatDateTime(v.lastSubmit)}>{fromNow(v.lastSubmit)}</Tooltip2>}
            </td>
            <td className="max-width">
                {v.translatedLetters > 0 && (
                    <div className="progress">
                        <div className="progress-bar bg-success" role="progressbar" style={{width: prApprovedP + "%"}}>
                        </div>
                        <div className="progress-bar" role="progressbar" style={{width: (prTranslatedP - prApprovedP)+"%"}}>
                        </div>
                    </div>
                )}
            </td>
            <td className="min-width">{v.translatedTexts} / {v.texts}</td>
        </tr>
    }
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
                <H2>Volumes</H2>
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