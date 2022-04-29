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
        case ProjectStatus.PROCESSING: return "Processing..."
        case ProjectStatus.ERROR: return "Error"
    }
}

function ProjectCardStatus({project}: {project: IProject}) {
    return <div className="project-card col-xs-12 col-sm-6 col-md-6 col-lg-4">
        <Card elevation={2}>
            <Container fluid>
                <Row>
                    <Col>
                        <Icon icon={IconNames.PROJECTS} intent={Intent.PRIMARY}/> {project.name}
                    </Col>
                    <Col>
                        {getStatusDescription(project.status)}
                    </Col>
                </Row>
            </Container>
        </Card>
    </div>
}

@withRouter
export default class ProjectCard extends Component<{project: IProject} & RouteProps> {
    render() {
        const {project} = this.props

        if (project.status === ProjectStatus.PROCESSING || project.status === ProjectStatus.ERROR) {
            return <ProjectCardStatus project={project} />
        }

        const prTranslated = project.translatedLetters / project.letters
        const prTranslatedP = Math.round(prTranslated * 100)
        const prApproved = project.approvedLetters / project.letters
        const prApprovedP = Math.round(prApproved * 100)

        return <div className="project-card col-xs-12 col-sm-6 col-md-6 col-lg-4">
            <Card elevation={2} interactive
                  onClick={this.onClick}
            >
                <Container fluid>
                    <Row>
                        <Col><Icon icon={IconNames.PROJECTS} intent={Intent.PRIMARY}/> {project.name}</Col>
                        {!!project.letters && (
                            <Col className="project-stats">
                                <div>Progress: {prTranslatedP}%</div>
                                <div>Texts: {project.translatedTexts} / {project.texts}</div>
                                <div>Letters: {project.translatedLetters} / {project.letters}</div>
                            </Col>
                        )}
                    </Row>
                    {!!project.letters && (
                        <Row>
                            <Col>
                                <div className="progress">
                                    <div className="progress-bar bg-success" role="progressbar" style={{width: prApprovedP + "%"}}>
                                    </div>
                                    <div className="progress-bar bg-warning" role="progressbar" style={{width: (prTranslatedP - prApprovedP)+"%"}}>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </Card>
        </div>
    }

    onClick = () => {
        this.props.history.push(`/projects/${this.props.project.code}`)
    }
}
