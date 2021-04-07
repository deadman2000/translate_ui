import React, {Component} from "react";
import {Button, Card, Icon} from "@blueprintjs/core";
import api from "@/api/Api";
import {Container, Row} from "react-bootstrap";
import {IconNames} from "@blueprintjs/icons";
import './ProjectsListPage.scss'
import {withRouter} from "react-router-dom";
import type {IProject} from "@/model/IProject";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";

function Cell(props) {
    return <div className="project-card col-xs-12 col-sm-6 col-md-6 col-lg-4">
        {props.children}
    </div>
}

@withRouter
class ProjectCard extends Component<{project: IProject} & RouteProps> {
    render() {
        return <Cell>
            <Card elevation={2} interactive
                  onClick={this.onClick}
            >
                <Icon icon={IconNames.PROJECTS}/> {this.props.project.name} <span>{this.props.project.status}</span>
            </Card>
        </Cell>
    }

    onClick = () => {
        this.props.history.push(`/projects/${this.props.project.shortName}`)
    }
}

@withRouter
export default class ProjectsListPage extends LoaderComponent<RouteProps, {projects: IProject[]}> {
    prepare() {
        return api.projects.list()
            .then(projects => this.setState({projects}))
    }

    successRender() {
        return <Container fluid className="projects-list">
            <Row>
                {this.state.projects.map(p => <ProjectCard key={p.id} project={p}/>)}
                <Cell>
                    <Button icon={IconNames.ADD}
                            text="Create project"
                            minimal fill
                            onClick={() => this.props.history.push('/projects/create')}
                    />
                </Cell>
            </Row>
        </Container>
    }
}