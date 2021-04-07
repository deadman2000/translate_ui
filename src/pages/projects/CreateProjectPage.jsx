import React, {Component} from "react/cjs/react.production.min";
import {FormGroup, H2, InputGroup} from "@blueprintjs/core";
import {Button, Container, Jumbotron} from "react-bootstrap";
import api from "@/api/Api";
import {withRouter} from "react-router-dom";
import type {RouteProps} from "@/types/RouteProps";

function calcShortName(str: string) {
    return str.toLowerCase().trim().replaceAll(/[^\w\d]/ig, '_').replaceAll(/__+/ig, '_')
}

@withRouter
export default class CreateProjectPage extends Component<RouteProps> {
    state = {
        projectName: '',
        shortName: undefined,
    }

    get shortName() {
        if (this.state.shortName)
            return this.state.shortName
        return calcShortName(this.state.projectName)
    }

    render() {
        return <Container className="p-3">
            <Jumbotron>
                <H2>Create new project</H2>

                <FormGroup
                    label="Project name"
                    labelFor="project-name"
                >
                    <InputGroup id="project-name"
                                onChange={e => this.setState({projectName: e.target.value})}
                                value={this.state.projectName}/>
                </FormGroup>

                <FormGroup
                    label="Short name"
                    labelFor="short-name"
                >
                    <InputGroup id="short-name"
                                onChange={e => this.setState({shortName: calcShortName(e.target.value)})}
                                value={this.shortName}/>
                </FormGroup>

                <Button onClick={this.createProject}>SUBMIT</Button>
            </Jumbotron>
        </Container>
    }

    createProject = () => {
        const {projectName} = this.state
        api.projects.create(projectName, this.shortName)
            .then(this.onCreated)
    }

    onCreated = project => {
        this.props.history.push(`/projects/${project.shortName}`)
    }
}
