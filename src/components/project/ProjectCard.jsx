import api from "@/api/Api"
import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Card, Icon, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Tooltip2} from "@blueprintjs/popover2";
import {Col, Container, Row} from "react-bootstrap";

import type {RouteProps} from "@/types/RouteProps";
import type {IProject} from "@/model/IProject";
import {ProjectStatus} from "@/enum";

function getStatusDescription(status: number) {
    switch (status) {
        case ProjectStatus.NEW: return "New"
        case ProjectStatus.TEXT_EXTRACT: return "Extract text..."
        case ProjectStatus.RES_EXTRACT: return "Extract resources..."
        case ProjectStatus.INDEXING: return "Indexing..."
        case ProjectStatus.READY: return ""
        case ProjectStatus.ERROR: return "Error"
        case ProjectStatus.TEXT_REEXTRACT: return "Extract new text..."
        default: return status.toString()
    }
}

function percentRounded(part: number, total: number) {
    const value = part || 0
    if (!total) return 0
    let rounded = Math.round((value / total) * 100)
    if (rounded === 100 && value !== total)
        rounded = 99
    return rounded
}

function TranslateStatus(props: { project: IProject }) {
    const {project} = props
    const prTranslatedP = percentRounded(project.translatedLetters, project.letters)

    return <>
        <div>Progress: {prTranslatedP}%</div>
        <div>Texts: {project.translatedTexts} / {project.texts}</div>
        <div>Letters: {project.translatedLetters} / {project.letters}</div>
    </>
}

function ProgressHint(props: { project: IProject }) {
    const {project} = props
    const translatedLetters = percentRounded(project.translatedLetters, project.letters)
    const approvedLetters = percentRounded(project.approvedLetters, project.letters)
    const translatedTexts = percentRounded(project.translatedTexts, project.texts)
    const approvedTexts = percentRounded(project.approvedTexts, project.texts)

    return <table className="project-progress-hint">
        <thead>
        <tr>
            <th/>
            <th>Letters</th>
            <th>Texts</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th><span className="swatch swatch-translated"/>Translated</th>
            <td>{translatedLetters}% <span className="hint-count">{project.translatedLetters} / {project.letters}</span></td>
            <td>{translatedTexts}% <span className="hint-count">{project.translatedTexts} / {project.texts}</span></td>
        </tr>
        <tr>
            <th><span className="swatch swatch-approved"/>Approved</th>
            <td>{approvedLetters}% <span className="hint-count">{project.approvedLetters || 0} / {project.letters}</span></td>
            <td>{approvedTexts}% <span className="hint-count">{project.approvedTexts || 0} / {project.texts}</span></td>
        </tr>
        </tbody>
    </table>
}

function TranslatePB(props: { project: IProject }) {
    const {project} = props

    const prTranslated = (project.translatedLetters / project.letters) * 100
    const prApproved = (project.approvedLetters / project.letters) * 100

    return <div className="progress">
        <div className="progress-bar bg-success" role="progressbar" style={{width: prApproved + "%"}}>
        </div>
        <div className="progress-bar bg-warning" role="progressbar" style={{width: (prTranslated - prApproved) + "%"}}>
        </div>
    </div>
}

type State = {
    interval: number,
    project: IProject
}

@withRouter
export default class ProjectCard extends Component<{project: IProject} & RouteProps, State> {
    state: State = {}

    componentDidMount() {
        const {project} = this.props
        this.setState({project})
        if (project.status !== ProjectStatus.READY) {
            const interval = setInterval(this.updateProj, 1000)
            this.setState({interval})
        }
    }

    updateProj = () => {
        const {project} = this.state

        api.projects.get(project.code)
            .then((proj) => {
                if (proj.status !== project.status)
                    this.setState({project: proj})
                if (proj.status === ProjectStatus.READY) {
                    clearInterval(this.state.interval)
                    this.setState({interval: null})
                }
            })
    }

    componentWillUnmount() {
        const {interval} = this.state
        if (interval) clearInterval(interval)
    }

    render() {
        const {project} = this.state
        if (!project) return <></>

        return <div className="project-card col-xs-12 col-sm-6 col-md-6 col-lg-4">
            <Tooltip2
                content={<ProgressHint project={project}/>}
                disabled={!project.letters}
                fill
                hoverOpenDelay={300}
                openOnTargetFocus={false}
            >
                <Card elevation={2} interactive
                      onClick={this.onClick}
                >
                    <Container fluid>
                        <Row>
                            <Col>
                                <div>
                                    <Icon icon={IconNames.PROJECTS} intent={Intent.PRIMARY}/> {project.name}
                                </div>
                                <div>
                                    {getStatusDescription(project.status)}
                                </div>
                            </Col>
                            <Col className="project-stats">
                                {!!project.letters && <TranslateStatus project={project}/>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {!!project.letters && <TranslatePB project={project}/>}
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </Tooltip2>
        </div>
    }

    onClick = () => {
        this.props.history.push(`/projects/${this.props.project.code}`)
    }
}
