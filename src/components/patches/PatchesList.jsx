import React from "react";
import {withRouter} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import {inject} from "mobx-react";
import {Button, Intent} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import {GlobalStore} from "@/stores/GlobalStore";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";
import type {IPatch} from "@/model/IPatch";

type States = {
    patches: IPatch[]
}

class PatchDeleteButton extends React.Component<{ project: string, patch: IPatch, onDeleted: (patch: IPatch) => void }> {
    state = {
        deleteConfirm: false
    }

    render() {
        return <Button icon={this.state.deleteConfirm ? IconNames.TICK_CIRCLE : IconNames.TRASH} intent={Intent.DANGER} minimal onClick={this.onClick}/>
    }

    onClick = () => {
        if (!this.state.deleteConfirm) {
            this.setState({deleteConfirm: true})
            return
        }

        api.project(this.props.project).deletePatch(this.props.patch.id)
            .then(() => this.props.onDeleted(this.props.patch))
    }
}

@inject("global")
@withRouter
export class PatchesList extends LoaderComponent<{ global?: GlobalStore } & RouteProps, States> {
    prepare(): Promise {
        return api.project(this.props.global.project.code).patches()
            .then(patches => {
                this.setState({patches})
            })
    }

    successRender() {
        const project = this.props.global.project.code
        const {patches} = this.state

        return <>
            <Container className="pt-2">
                <div className="buttons-container">
                    <Button icon={IconNames.CLOUD_UPLOAD} text="Upload" onClick={this.uploadClick}/>
                </div>
                <Table striped>
                    <tbody>
                    {patches.map(p => <tr key={p.id}>
                        <td className="max-width"><a href={`/api/projects/${project}/patches/${p.id}`}>{p.fileName}</a></td>
                        <td><PatchDeleteButton patch={p} project={project} onDeleted={this.deletePatch} /></td>
                    </tr>)}
                    </tbody>
                </Table>
            </Container>
        </>
    }

    uploadClick = () => {
        this.props.history.push(`${this.props.match.url}/upload`)
    }

    deletePatch = (patch: IPatch) => {
        const i = this.state.patches.indexOf(patch)
        this.state.patches.splice(i, 1)
        this.setState({patches: this.state.patches})
    }
}