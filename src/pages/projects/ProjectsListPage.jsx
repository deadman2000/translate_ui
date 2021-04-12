import React from "react";
import {withRouter} from "react-router-dom";
import {Container, Row} from "react-bootstrap";

import api from "@/api/Api";
import type {IProject} from "@/model/IProject";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";
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
            </Row>
        </Container>
    }
}