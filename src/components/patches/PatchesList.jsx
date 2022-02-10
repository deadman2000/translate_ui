import DeleteConfirmButton from "@/components/DeleteConfirmButton";
import React from "react";
import {withRouter} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import {inject} from "mobx-react";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import api from "@/api/Api";
import {GlobalStore} from "@/stores/GlobalStore";
import type {RouteProps} from "@/types/RouteProps";
import LoaderComponent from "@/components/LoaderComponent";
import type {IPatch} from "@/model/IPatch";

type States = {
    patches: IPatch[]
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
                <div className="buttons-container mt-2 mb-2">
                    <Button icon={IconNames.CLOUD_UPLOAD} text="Upload" onClick={this.uploadClick}/>
                </div>
                <Table striped>
                    <tbody>
                    {patches.map(p => <tr key={p.id}>
                        <td className="max-width"><a href={`/api/projects/${project}/patches/${p.id}`}>{p.fileName}</a></td>
                        <td><DeleteConfirmButton onConfirm={() => this.deletePatch(p)} /></td>
                    </tr>)}
                    </tbody>
                </Table>
            </Container>
        </>
    }

    uploadClick = () => {
        this.props.history.push(`${this.props.match.url}/upload`)
    }

    deletePatch(patch: IPatch) {
        const project = this.props.global.project.code
        api.project(project).deletePatch(patch.id)
            .then(() => {
                const i = this.state.patches.indexOf(patch)
                this.state.patches.splice(i, 1)
                this.setState({patches: this.state.patches})
            })
    }
}