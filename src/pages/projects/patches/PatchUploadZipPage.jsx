import api from "@/api/Api"
import {GlobalStore} from "@/stores/GlobalStore"
import type {RouteProps} from "@/types/RouteProps"
import {Button, Intent, ProgressBar} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {inject} from "mobx-react"
import React from "react"
import {Container} from "react-bootstrap"
import {FileUploader} from "react-drag-drop-files"
import {withRouter} from "react-router-dom"

type State = {
    uploading: boolean,
    file: File,
    progress: number
}

const fileTypes = ["ZIP"];

@inject("global")
@withRouter
export class PatchUploadZipPage extends  React.Component<{global?: GlobalStore} & RouteProps, State> {
    state: State = {
        uploading: false,
        file: null,
    }

    render() {
        const {uploading, file} = this.state

        return <Container className="p-3">
            <div>
                <Button onClick={this.backClick} icon={IconNames.ARROW_LEFT} text="Back" minimal />
            </div>

            <FileUploader handleChange={this.handleChange} types={fileTypes} />
            {file && <Button onClick={this.upload} disabled={!this.state.file} text={`UPLOAD ${file.name}`} />}

            {uploading && <ProgressBar value={this.state.progress} intent={Intent.PRIMARY} />}
        </Container>
    }

    handleChange = (file: File) => {
        this.setState({file})
    }

    backClick = () => {
        const {project, tabid} = this.props.match.params
        this.props.history.push(`/projects/${project}/${tabid}`)
    }

    upload = () => {
        const project = this.props.global.project
        const {file} = this.state

        this.setState({
            uploading: true,
        });

        api.project(project.code).uploadZipPatch(file, this.onProgress)
            .then(this.onUploaded)
            .finally(() => this.setState({uploading: false}))
    }

    onProgress = (event) => {
        this.setState({
            progress: event.loaded / event.total,
        });
    }

    onUploaded = () => {
        const {project, tabid} = this.props.match.params
        this.props.history.replace(`/projects/${project}/${tabid}`)
    }
}