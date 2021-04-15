import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Card, Icon, Intent, ProgressBar} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {Col, Container, Row} from "react-bootstrap";

import type {RouteProps} from "@/types/RouteProps";
import type {IProject} from "@/model/IProject";


@withRouter
export default class ProjectCard extends Component<{project: IProject} & RouteProps> {
    render() {
        const {project} = this.props

        const progress = project.translatedLetters / project.letters;

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
                            {Math.round(progress * 100)}% {project.translatedTexts} / {project.texts}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ProgressBar
                                intent={Intent.PRIMARY}
                                stripes={false}
                                value={progress}
                            />
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
