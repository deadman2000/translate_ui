import api from "@/api/Api";
import {GlobalStore} from "@/stores/GlobalStore";
import type {RouteProps} from "@/types/RouteProps";
import {Button, FileInput, FormGroup, Intent, ProgressBar} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {inject} from "mobx-react";
import React from "react";
import {Container} from "react-bootstrap";
import {withRouter} from "react-router-dom";

@inject("global")
@withRouter
export default class PatchUploadPage extends React.Component<{global?: GlobalStore} & RouteProps> {
    state = {
        uploading: false,
        progress: 0,
        file: null,
    }

    render() {
        const {uploading, file} = this.state

        return <Container className="p-3">
            <div>
                <Button onClick={this.backClick} icon={IconNames.ARROW_LEFT} text="Back" minimal />
            </div>
            <FormGroup
                label="File"
                labelFor="file"
            >
                <FileInput id="file"
                           fill
                           text={file ? file.name : "Choose file..."}
                           onInputChange={this.selectFile} />
                {uploading && <ProgressBar value={this.state.progress} intent={Intent.PRIMARY} />}

                <Button onClick={this.upload} disabled={!this.state.file} text="UPLOAD" />
            </FormGroup>
        </Container>
    }

    backClick = () => {
        const {project, tabid} = this.props.match.params
        this.props.history.push(`/projects/${project}/${tabid}`)
    }

    selectFile = (event) => {
        const file = event.target.files[0]
        this.setState({
            file: file,
        });
    }

    upload = () => {
        const project = this.props.global.project
        const {file} = this.state

        this.setState({
            uploading: true,
        });

        api.project(project.code).uploadPatch(file, this.onProgress)
            .then(this.onUploaded)
            .finally(() => this.setState({uploading: false}))
    }

    onProgress = (event) => {
        this.setState({
            progress: event.loaded / event.total
        });
    }

    onUploaded = () => {
        const {project, tabid} = this.props.match.params
        this.props.history.replace(`/projects/${project}/${tabid}`)
    }
}