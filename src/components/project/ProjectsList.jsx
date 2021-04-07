import React, {Component} from "react";
import {Button, Card, Icon, Spinner} from "@blueprintjs/core";
import api from "@/api/Api";
import {Container, Row} from "react-bootstrap";
import {IconNames} from "@blueprintjs/icons";
import './ProjectsList.scss'
import {withRouter} from "react-router-dom";
import type {IProject} from "@/model/IProject";
import type {RouteProps} from "@/types/RouteProps";

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
export default class ProjectsList extends Component<RouteProps, {projects: IProject[]}> {
    state = {
        loading: true,
        error: false,
        projects: []
    }

    componentDidMount() {
        this.loadList()
    }

    loadList() {
        this.setState({
            loading: true,
            error: false
        })
        api.projects.list()
            .then(projects => this.setState({projects}))
            .catch(() => this.setState({error: true}))
            .finally(() => this.setState({loading: false}))
    }

    render() {
        if (this.state.loading)
            return <Spinner />

        if (this.state.error)
            return <>
                Error
                <Button text="Retry"
                        onClick={() => this.loadList()}
                        minimal
                />
            </>

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