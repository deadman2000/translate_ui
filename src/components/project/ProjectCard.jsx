import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Card, Icon, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Col, Container, Row} from "react-bootstrap";

import type {RouteProps} from "@/types/RouteProps";
import type {IProject} from "@/model/IProject";


@withRouter
export default class ProjectCard extends Component<{project: IProject} & RouteProps> {
    render() {
        const {project} = this.props

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
                        <Col>
                            <Icon icon={IconNames.PROJECTS} intent={Intent.PRIMARY}/> {project.name}
                        </Col>
                        <Col>
                            {prTranslatedP}% {project.translatedTexts} / {project.texts}
                        </Col>
                    </Row>
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
                </Container>
            </Card>
        </div>
    }

    onClick = () => {
        this.props.history.push(`/projects/${this.props.project.code}`)
    }
}
