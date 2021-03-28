import React, {Component} from "react";
import type {IProject} from "@/model/IProject";
import {Button, Container, Jumbotron} from "react-bootstrap";
import {FileInput, FormGroup, H2, H4, Intent, ProgressBar} from "@blueprintjs/core";
import api from "@/api/Api";

export class UploadingProject extends Component<{project: IProject}> {
    state = {
        uploading: false,
        progress: 0,
        file: null,
    }

    render() {
        const {project} = this.props
        const {uploading, file} = this.state

        return <Container className="p-3">
            <Jumbotron>
                <H2>{project.name}</H2>
                <H4>Uploading</H4>

                <FormGroup
                    label="Game zip-archive"
                    labelFor="game-archive"
                >
                    <FileInput id="game-archive"
                               fill
                               text={file ? file.name : "Choose file..."}
                               onInputChange={this.selectFile} />
                    {uploading && <ProgressBar value={this.state.progress} intent={Intent.PRIMARY} />}
                </FormGroup>

                <Button onClick={this.upload} disabled={!this.state.file}>UPLOAD</Button>
            </Jumbotron>
        </Container>
    }

    selectFile = (event) => {
        const file = event.target.files[0]
        this.setState({
            file: file,
        });
    }

    upload = () => {
        const {project} = this.props
        const {file} = this.state

        this.setState({
            uploading: true,
        });

        api.projects.upload(project.shortName, file, this.onProgress)
            .then(this.onUploaded)
            .finally(() => this.setState({uploading: false}))
    }

    onProgress = (event) => {
        this.setState({
            progress: event.loaded / event.total
        });
    }

    onUploaded = () => {
    }
}