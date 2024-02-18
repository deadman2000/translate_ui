import api from "@/api/Api";
import {GlobalStore} from "@/stores/GlobalStore";
import type {RouteProps} from "@/types/RouteProps";
import {Button, Intent, ProgressBar} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import {inject} from "mobx-react";
import React from "react";
import {Container, Table} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";

type UploadFile = {
    file: File,
    progress: number,
    uploaded: number,
}

type State = {
    uploading: boolean,
    progress: number,
    totalSize: number,
    uploadedSize: number,
    files: UploadFile[]
}

@inject("global")
@withRouter
export default class PatchUploadPage extends React.Component<{global?: GlobalStore} & RouteProps, State> {
    state: State = {
        uploading: false,
        progress: 0,
        totalSize: 0,
        files: [],
    }

    componentDidMount() {
        document.title = `Upload ${this.props.global.project.name}`;
    }

    render() {
        const {uploading, files} = this.state

        return <Container className="p-3">
            <div>
                <Button onClick={this.backClick} icon={IconNames.ARROW_LEFT} text="Back" minimal />
            </div>

            <FileUploader handleChange={this.handleChange} multiple />
            <Button onClick={this.upload} disabled={this.state.files.length === 0} text="UPLOAD" />

            <div>
                Total Size: {this.state.totalSize}
            </div>

            {uploading && <ProgressBar value={this.state.progress} intent={Intent.PRIMARY} />}
            <Table>
                <tbody>
                {files.map(f => <tr key={f.file.name}>
                    <td style={{width: "1%"}}><Button minimal icon={IconNames.TRASH} onClick={() => this.deleteFile(f)} /></td>
                    <td>{f.file.name}</td>
                    <td>{f.file.size}</td>
                    <td>{uploading && <ProgressBar value={f.progress} intent={Intent.PRIMARY} />}</td>
                </tr>)}
                </tbody>
            </Table>
        </Container>
    }

    deleteFile(f: File) {
        const {files} = this.state
        const i = files.indexOf(f)
        files.splice(i, 1)
        this.setState({files})
    }

    handleChange = (fileList: FileList) => {
        const {files} = this.state
        for (let i = 0; i < fileList.length; i++) {
            files.push({
                file: fileList[i],
                progress: 0,
                uploaded: 0
            })
        }

        const totalSize = files.map(f => f.file.size).reduce((prev, next) => prev + next)

        this.setState({files, totalSize})
    }

    backClick = () => {
        const {project, tabid} = this.props.match.params
        this.props.history.push(`/projects/${project}/${tabid}`)
    }

    upload = () => {
        const project = this.props.global.project
        const {files} = this.state

        this.setState({
            uploading: true,
        });

        Promise.all(files.map(file => api.project(project.code).uploadPatch(file.file, (e) => this.onProgress(file, e))))
            .then(this.onUploaded)
            .finally(() => this.setState({uploading: false}))
    }

    onProgress = (file: UploadFile, event) => {
        const {files, totalSize} = this.state

        file.uploaded = event.loaded
        file.progress = event.loaded / event.total

        const totalUploaded = files.map(f => f.uploaded).reduce((prev, next) => prev + next)

        this.setState({
            progress: totalUploaded / totalSize,
            files
        });
    }

    onUploaded = () => {
        const {project, tabid} = this.props.match.params
        this.props.history.replace(`/projects/${project}/${tabid}`)
    }
}