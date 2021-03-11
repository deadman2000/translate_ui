import React, {Component} from "react";
import {Container, Jumbotron} from "react-bootstrap";
import {FileInput, FormGroup, H2, Intent, ProgressBar} from "@blueprintjs/core";
import api from "@/api/Api";

export default class EditProject extends Component<{}> {
    state = {
        uploading: false,
        progress: 0,
        selectedFile: null,
    }

    render() {
        const {uploading, selectedFile} = this.state

        return <Container className="p-3">
            <Jumbotron>
                <H2>Uploading</H2>

                <FormGroup
                    label="Game zip-archive"
                    labelFor="game-archive"
                >
                    <FileInput id="game-archive"
                               fill
                               text={selectedFile ? selectedFile.name : "Choose file..."}
                               onInputChange={this.selectFile} />
                    {uploading && <ProgressBar value={this.state.progress} intent={Intent.PRIMARY} />}
                </FormGroup>

            </Jumbotron>
        </Container>
    }

    selectFile = (event) => {
        const file = event.target.files[0]
        this.setState({
            selectedFile: file,
            uploading: true,
        });
        api.project.upload(file, this.onProgress)
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