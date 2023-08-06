import api from "@/api/Api"
import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Card, Icon, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
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
        default: return status.toString()
    }
}

function TranslateStatus(props: { project: IProject }) {
    const {project} = props

    const prTranslated = (project.translatedLetters / project.letters) * 100
    let prTranslatedP = Math.round(prTranslated)
    if (prTranslatedP === 100 && project.translatedLetters !== project.letters)
        prTranslatedP = 99

    return <>
        <div>Progress: {prTranslatedP}%</div>
        <div>Texts: {project.translatedTexts} / {project.texts}</div>
        <div>Letters: {project.translatedLetters} / {project.letters}</div>
    </>
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
        </div>
    }

    onClick = () => {
        this.props.history.push(`/projects/${this.props.project.code}`)
    }
}
