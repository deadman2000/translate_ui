import React from "react";
import {withRouter} from "react-router-dom";
import {Container, Row} from "react-bootstrap";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";
import ProjectCell from "@/components/project/ProjectCell";
import ProjectCard from "@/components/project/ProjectCard";
import './ProjectsListPage.scss'

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
                <ProjectCell>
                    <Button icon={IconNames.ADD}
                            text="Create project"
                            minimal fill
                            onClick={() => this.props.history.push('/projects/create')}
                    />
                </ProjectCell>
            </Row>
        </Container>
    }
}