import React, {Component} from "react/cjs/react.production.min";
import {FormGroup, H2, InputGroup} from "@blueprintjs/core";
import {Button, Container, Jumbotron} from "react-bootstrap";

function calcShortName(str: string) {
    return str.toLowerCase().trim().replaceAll(/[^\w\d]/ig, '_').replaceAll(/__+/ig, '_')
}

export default class CreateProject extends Component<{}> {
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
        
    }
}
