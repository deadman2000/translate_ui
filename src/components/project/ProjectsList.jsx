import React, {Component} from "react";
import {Button, Card, Icon, Spinner} from "@blueprintjs/core";
import api from "@/api/Api";
import {Container, Row} from "react-bootstrap";
import {IconNames} from "@blueprintjs/icons";

import './ProjectsList.scss'
import {withRouter} from "react-router";

class ProjectCard extends Component<{}> {
    render() {
        return <div className="project-card col-xs-12 col-sm-4 col-md-3 col-lg-2">
            <Card elevation={2} interactive >
                <Icon icon={IconNames.PROJECTS}/> Test asd asd asdas d asd asda sdasdadasdasd
            </Card>
        </div>
    }
}

@withRouter
export default class ProjectsList extends Component<{history?: History}> {
    state = {
        loading: false,
        projects: []
    }

    componentDidMount() {
        api.project.list()
            .then(projects => this.setState({projects}))
            .finally(() => this.setState({loading: false}))
    }

    render() {
        if (this.state.loading)
            return <Spinner />

        return <Container fluid className="projects-list">
            <Row>
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <div className="project-card col-xs-12 col-sm-4 col-md-3 col-lg-2">
                    <Button icon={IconNames.ADD}
                            text="Create project"
                            minimal fill
                            onClick={() => this.prop.history.push('/projects/create')}
                    />
                </div>
            </Row>
        </Container>
    }
}