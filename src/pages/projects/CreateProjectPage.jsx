import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Button, Container, Jumbotron} from "react-bootstrap";
import {FormGroup, H2, HTMLSelect, InputGroup} from "@blueprintjs/core";

import api from "@/api/Api";
import type {RouteProps} from "@/types/RouteProps";

function calcCode(str: string) {
    return str.toLowerCase().trim().replaceAll(/[^\w\d]/ig, '_').replaceAll(/__+/ig, '_')
}

@withRouter
export default class CreateProjectPage extends Component<RouteProps> {
    state = {
        projectName: '',
        code: undefined,
        engine: "sci"
    }

    get code() {
        if (this.state.code)
            return this.state.code
        return calcCode(this.state.projectName)
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
                                onChange={e => this.setState({code: calcCode(e.target.value)})}
                                value={this.code}/>
                </FormGroup>

                <FormGroup
                    label="Engine"
                    labelFor="engine"
                >
                    <HTMLSelect id="engine"
                            onChange={e => this.setState({engine: e.target.value})}
                            value={this.state.engine}>
                        <option value="sci">SCI</option>
                        <option value="ags">AGS</option>
                    </HTMLSelect>
                </FormGroup>

                <div>
                    <Button onClick={this.createProject} className="mr-2">CREATE</Button>
                    <Button onClick={this.cancel} variant="outline-secondary">CANCEL</Button>
                </div>
            </Jumbotron>
        </Container>
    }

    createProject = () => {
        const {projectName, engine} = this.state
        api.projects.create(projectName, this.code, engine)
            .then(this.onCreated)
    }

    onCreated = project => {
        this.props.history.push(`/projects/${project.code}`)
    }

    cancel = () => {
        this.props.history.replace('/projects')
    }
}
